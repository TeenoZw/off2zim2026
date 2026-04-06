-- Comprehensive service provider system migration

-- Create service_providers table
CREATE TABLE IF NOT EXISTS public.service_providers (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	business_name TEXT NOT NULL,
	business_email TEXT,
	business_registration_number TEXT,
	tax_number TEXT,
	business_type TEXT NOT NULL CHECK (business_type IN ('stays', 'events', 'activities', 'bus', 'flights', 'restaurant')),
	contact_person_name TEXT,
	email TEXT,
	phone TEXT,
	website TEXT,
	address TEXT,
	city TEXT,
	country TEXT DEFAULT 'Zimbabwe',
	capabilities TEXT[] DEFAULT '{}',
	service_areas TEXT[] DEFAULT '{}',
	languages_spoken TEXT[] DEFAULT '{"English"}',
	business_hours JSONB DEFAULT '{}',
	description TEXT,
	setup_completed BOOLEAN DEFAULT FALSE,
	verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected')),
	certificate_of_incorporation_url TEXT,
	tax_clearance_url TEXT,
	tourism_license_url TEXT,
	trading_license_url TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_capabilities table
CREATE TABLE IF NOT EXISTS public.provider_capabilities (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	capability_type TEXT NOT NULL,
	capability_name TEXT NOT NULL,
	available BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_rooms table (for stays)
CREATE TABLE IF NOT EXISTS public.provider_rooms (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	room_type TEXT NOT NULL,
	capacity INTEGER NOT NULL,
	base_price DECIMAL(10,2) NOT NULL,
	amenities TEXT[] DEFAULT '{}',
	images TEXT[] DEFAULT '{}',
	description TEXT,
	available BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_galleries table
CREATE TABLE IF NOT EXISTS public.provider_galleries (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	image_url TEXT NOT NULL,
	caption TEXT,
	is_featured BOOLEAN DEFAULT FALSE,
	sort_order INTEGER DEFAULT 0,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create room_availability table
CREATE TABLE IF NOT EXISTS public.room_availability (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	room_id UUID REFERENCES public.provider_rooms(id) ON DELETE CASCADE,
	date DATE NOT NULL,
	available_count INTEGER NOT NULL DEFAULT 0,
	price_override DECIMAL(10,2),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	UNIQUE(room_id, date)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	room_id UUID REFERENCES public.provider_rooms(id),
	booking_type TEXT NOT NULL CHECK (booking_type IN ('stays', 'events', 'activities', 'transport', 'flights', 'restaurant')),
	check_in_date DATE,
	check_out_date DATE,
	guest_count INTEGER,
	total_amount DECIMAL(10,2) NOT NULL,
	commission_amount DECIMAL(10,2),
	status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
	payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
	booking_details JSONB DEFAULT '{}',
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_transactions table
CREATE TABLE IF NOT EXISTS public.provider_transactions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	booking_id UUID REFERENCES public.bookings(id),
	transaction_type TEXT NOT NULL CHECK (transaction_type IN ('commission', 'payout', 'refund', 'adjustment')),
	amount DECIMAL(10,2) NOT NULL,
	currency TEXT DEFAULT 'USD',
	payment_method TEXT,
	payment_reference TEXT,
	status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
	processed_at TIMESTAMP WITH TIME ZONE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_reviews table
CREATE TABLE IF NOT EXISTS public.provider_reviews (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	booking_id UUID REFERENCES public.bookings(id),
	rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
	review_text TEXT,
	response_text TEXT,
	response_date TIMESTAMP WITH TIME ZONE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_settings table
CREATE TABLE IF NOT EXISTS public.provider_settings (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	setting_key TEXT NOT NULL,
	setting_value JSONB,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	UNIQUE(provider_id, setting_key)
);

-- Create provider_analytics table
CREATE TABLE IF NOT EXISTS public.provider_analytics (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	metric_date DATE NOT NULL,
	views INTEGER DEFAULT 0,
	bookings INTEGER DEFAULT 0,
	revenue DECIMAL(10,2) DEFAULT 0,
	commission_paid DECIMAL(10,2) DEFAULT 0,
	average_rating DECIMAL(3,2),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	UNIQUE(provider_id, metric_date)
);

-- Create provider_documents table
CREATE TABLE IF NOT EXISTS public.provider_documents (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'tourism_license', 'tax_certificate', 'insurance', 'other')),
	document_url TEXT NOT NULL,
	file_name TEXT,
	file_size INTEGER,
	verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
	verification_notes TEXT,
	uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	verified_at TIMESTAMP WITH TIME ZONE
);

-- Create provider_payouts table
CREATE TABLE IF NOT EXISTS public.provider_payouts (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
	amount DECIMAL(10,2) NOT NULL,
	currency TEXT DEFAULT 'USD',
	payment_method TEXT NOT NULL,
	payment_details JSONB DEFAULT '{}',
	status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
	initiated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
	completed_at TIMESTAMP WITH TIME ZONE,
	failure_reason TEXT
);

-- Enable Row Level Security
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own service provider data" ON public.service_providers
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own service provider data" ON public.service_providers
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service provider data" ON public.service_providers
	FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers can manage their capabilities" ON public.provider_capabilities
	FOR ALL USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can manage their own rooms" ON public.provider_rooms
	FOR ALL USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can manage their own gallery" ON public.provider_galleries
	FOR ALL USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can manage room availability" ON public.room_availability
	FOR ALL USING (
		room_id IN (
			SELECT r.id FROM public.provider_rooms r
			INNER JOIN public.service_providers sp ON r.provider_id = sp.id
			WHERE sp.user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can view their bookings" ON public.bookings
	FOR SELECT USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Customers can view their bookings" ON public.bookings
	FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create bookings" ON public.bookings
	FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can view their transactions" ON public.provider_transactions
	FOR SELECT USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Everyone can view reviews" ON public.provider_reviews
	FOR SELECT USING (TRUE);

CREATE POLICY "Customers can create reviews" ON public.provider_reviews
	FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can respond to their reviews" ON public.provider_reviews
	FOR UPDATE USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can manage their settings" ON public.provider_settings
	FOR ALL USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can view their analytics" ON public.provider_analytics
	FOR SELECT USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can manage their documents" ON public.provider_documents
	FOR ALL USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "Providers can view their payouts" ON public.provider_payouts
	FOR SELECT USING (
		provider_id IN (
			SELECT id FROM public.service_providers WHERE user_id = auth.uid()
		)
	);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON public.service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_business_type ON public.service_providers(business_type);
CREATE INDEX IF NOT EXISTS idx_provider_capabilities_provider_id ON public.provider_capabilities(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_rooms_provider_id ON public.provider_rooms(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_galleries_provider_id ON public.provider_galleries(provider_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_room_id_date ON public.room_availability(room_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_provider_transactions_provider_id ON public.provider_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_reviews_provider_id ON public.provider_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_analytics_provider_id_date ON public.provider_analytics(provider_id, metric_date);

-- Trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = TIMEZONE('utc'::text, NOW());
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_service_providers_updated_at
	BEFORE UPDATE ON public.service_providers
	FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_rooms_updated_at
	BEFORE UPDATE ON public.provider_rooms
	FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
	BEFORE UPDATE ON public.bookings
	FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_settings_updated_at
	BEFORE UPDATE ON public.provider_settings
	FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commission calculation
CREATE OR REPLACE FUNCTION calculate_commission(business_type TEXT, total_amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
	RETURN CASE
		WHEN business_type = 'stays' THEN total_amount * 0.15
		WHEN business_type = 'activities' THEN total_amount * 0.10
		WHEN business_type IN ('transport', 'bus') THEN total_amount * 0.08
		WHEN business_type = 'events' THEN total_amount * 0.12
		WHEN business_type = 'flights' THEN total_amount * 0.05
		WHEN business_type = 'restaurant' THEN total_amount * 0.10
		ELSE total_amount * 0.10
	END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_booking_commission()
RETURNS TRIGGER AS $$
BEGIN
	NEW.commission_amount = calculate_commission(NEW.booking_type, NEW.total_amount);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_booking_commission
	BEFORE INSERT OR UPDATE ON public.bookings
	FOR EACH ROW EXECUTE FUNCTION set_booking_commission();
