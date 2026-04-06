-- Create user_likes table for tracking what users have liked
CREATE TABLE IF NOT EXISTS public.user_likes (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
	
	-- What they liked (polymorphic - can be stay, event, activity, restaurant, etc.)
	likeable_type TEXT NOT NULL CHECK (likeable_type IN ('stay', 'event', 'activity', 'restaurant', 'bus', 'flight', 'service_provider')),
	likeable_id TEXT NOT NULL, -- Can be UUID or string ID
	
	-- Additional context
	metadata JSONB DEFAULT '{}', -- Store any additional info like price at time of like, etc.
	
	-- Timestamps
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	
	-- Ensure user can only like something once
	UNIQUE(user_id, likeable_type, likeable_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON public.user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_likeable ON public.user_likes(likeable_type, likeable_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_created_at ON public.user_likes(created_at DESC);

-- Create likes_count table for caching like counts per item
CREATE TABLE IF NOT EXISTS public.likes_count (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	
	-- What is being liked
	likeable_type TEXT NOT NULL CHECK (likeable_type IN ('stay', 'event', 'activity', 'restaurant', 'bus', 'flight', 'service_provider')),
	likeable_id TEXT NOT NULL,
	
	-- Count
	count INTEGER DEFAULT 0 NOT NULL CHECK (count >= 0),
	
	-- Timestamps
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	
	-- Ensure only one count record per item
	UNIQUE(likeable_type, likeable_id)
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_likes_count_likeable ON public.likes_count(likeable_type, likeable_id);

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO public.likes_count (likeable_type, likeable_id, count)
	VALUES (NEW.likeable_type, NEW.likeable_id, 1)
	ON CONFLICT (likeable_type, likeable_id)
	DO UPDATE SET 
		count = public.likes_count.count + 1,
		updated_at = TIMEZONE('utc'::text, NOW());
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like_count()
RETURNS TRIGGER AS $$
BEGIN
	UPDATE public.likes_count
	SET 
		count = GREATEST(count - 1, 0),
		updated_at = TIMEZONE('utc'::text, NOW())
	WHERE likeable_type = OLD.likeable_type 
		AND likeable_id = OLD.likeable_id;
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update like counts
CREATE TRIGGER trigger_increment_like_count
	AFTER INSERT ON public.user_likes
	FOR EACH ROW
	EXECUTE FUNCTION increment_like_count();

CREATE TRIGGER trigger_decrement_like_count
	AFTER DELETE ON public.user_likes
	FOR EACH ROW
	EXECUTE FUNCTION decrement_like_count();

-- Enable Row Level Security
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes_count ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_likes

-- Users can view their own likes
CREATE POLICY "Users can view their own likes"
	ON public.user_likes
	FOR SELECT
	USING (auth.uid() = user_id);

-- Users can insert their own likes
CREATE POLICY "Users can insert their own likes"
	ON public.user_likes
	FOR INSERT
	WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes (unlike)
CREATE POLICY "Users can delete their own likes"
	ON public.user_likes
	FOR DELETE
	USING (auth.uid() = user_id);

-- RLS Policies for likes_count

-- Anyone can view like counts (public information)
CREATE POLICY "Anyone can view like counts"
	ON public.likes_count
	FOR SELECT
	USING (true);

-- Only system can modify counts (via triggers)
CREATE POLICY "System can update like counts"
	ON public.likes_count
	FOR ALL
	USING (false)
	WITH CHECK (false);

-- Helper function to check if user has liked something
CREATE OR REPLACE FUNCTION user_has_liked(
	p_user_id UUID,
	p_likeable_type TEXT,
	p_likeable_id TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
	RETURN EXISTS (
		SELECT 1 FROM public.user_likes
		WHERE user_id = p_user_id
			AND likeable_type = p_likeable_type
			AND likeable_id = p_likeable_id
	);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get like count for an item
CREATE OR REPLACE FUNCTION get_like_count(
	p_likeable_type TEXT,
	p_likeable_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
	v_count INTEGER;
BEGIN
	SELECT count INTO v_count
	FROM public.likes_count
	WHERE likeable_type = p_likeable_type
		AND likeable_id = p_likeable_id;
	
	RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to toggle like (like/unlike)
CREATE OR REPLACE FUNCTION toggle_like(
	p_user_id UUID,
	p_likeable_type TEXT,
	p_likeable_id TEXT,
	p_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
	v_is_liked BOOLEAN;
	v_like_count INTEGER;
BEGIN
	-- Check if already liked
	v_is_liked := user_has_liked(p_user_id, p_likeable_type, p_likeable_id);
	
	IF v_is_liked THEN
		-- Unlike (delete)
		DELETE FROM public.user_likes
		WHERE user_id = p_user_id
			AND likeable_type = p_likeable_type
			AND likeable_id = p_likeable_id;
		
		v_is_liked := FALSE;
	ELSE
		-- Like (insert)
		INSERT INTO public.user_likes (user_id, likeable_type, likeable_id, metadata)
		VALUES (p_user_id, p_likeable_type, p_likeable_id, p_metadata)
		ON CONFLICT (user_id, likeable_type, likeable_id) DO NOTHING;
		
		v_is_liked := TRUE;
	END IF;
	
	-- Get updated count
	v_like_count := get_like_count(p_likeable_type, p_likeable_id);
	
	-- Return result
	RETURN jsonb_build_object(
		'is_liked', v_is_liked,
		'like_count', v_like_count
	);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's liked items by type
CREATE OR REPLACE FUNCTION get_user_likes(
	p_user_id UUID,
	p_likeable_type TEXT DEFAULT NULL,
	p_limit INTEGER DEFAULT 100,
	p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
	likeable_type TEXT,
	likeable_id TEXT,
	metadata JSONB,
	created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
	RETURN QUERY
	SELECT 
		ul.likeable_type,
		ul.likeable_id,
		ul.metadata,
		ul.created_at
	FROM public.user_likes ul
	WHERE ul.user_id = p_user_id
		AND (p_likeable_type IS NULL OR ul.likeable_type = p_likeable_type)
	ORDER BY ul.created_at DESC
	LIMIT p_limit
	OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for service providers to see who liked their items
CREATE OR REPLACE FUNCTION get_provider_likes(
	p_provider_id UUID,
	p_likeable_type TEXT DEFAULT NULL
)
RETURNS TABLE (
	user_id UUID,
	likeable_type TEXT,
	likeable_id TEXT,
	created_at TIMESTAMP WITH TIME ZONE,
	like_count BIGINT
) AS $$
BEGIN
	RETURN QUERY
	SELECT 
		ul.user_id,
		ul.likeable_type,
		ul.likeable_id,
		ul.created_at,
		COUNT(*) OVER (PARTITION BY ul.likeable_type, ul.likeable_id) as like_count
	FROM public.user_likes ul
	WHERE ul.likeable_id IN (
		-- Get all items belonging to this provider
		SELECT s.id::TEXT FROM public.stays s 
		WHERE s.provider_id = p_provider_id
		UNION
		-- Add other item types as needed (events, activities, etc.)
		SELECT sp.id::TEXT FROM public.service_providers sp
		WHERE sp.id = p_provider_id
	)
	AND (p_likeable_type IS NULL OR ul.likeable_type = p_likeable_type)
	ORDER BY ul.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add like_count column to stays table for easy access
ALTER TABLE public.stays 
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Create trigger to sync like_count on stays table
CREATE OR REPLACE FUNCTION sync_stay_like_count()
RETURNS TRIGGER AS $$
BEGIN
	UPDATE public.stays
	SET like_count = NEW.count
	WHERE id::TEXT = NEW.likeable_id 
		AND NEW.likeable_type = 'stay';
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_stay_like_count
	AFTER INSERT OR UPDATE ON public.likes_count
	FOR EACH ROW
	WHEN (NEW.likeable_type = 'stay')
	EXECUTE FUNCTION sync_stay_like_count();

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.user_likes TO authenticated;
GRANT SELECT ON public.likes_count TO authenticated;
GRANT SELECT ON public.likes_count TO anon;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION user_has_liked(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_like_count(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_like_count(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION toggle_like(UUID, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_likes(UUID, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_provider_likes(UUID, TEXT) TO authenticated;

-- Initialize like counts for existing stays
INSERT INTO public.likes_count (likeable_type, likeable_id, count)
SELECT 'stay', id::TEXT, 0
FROM public.stays
ON CONFLICT (likeable_type, likeable_id) DO NOTHING;

COMMENT ON TABLE public.user_likes IS 'Tracks user likes/favorites for any type of content (stays, events, activities, etc.)';
COMMENT ON TABLE public.likes_count IS 'Cached count of likes per item for performance';
COMMENT ON FUNCTION toggle_like IS 'Toggle like/unlike for a user on any item. Returns new like status and count.';
COMMENT ON FUNCTION get_user_likes IS 'Get all items a user has liked, optionally filtered by type';
COMMENT ON FUNCTION get_provider_likes IS 'Get all likes for items belonging to a service provider';
