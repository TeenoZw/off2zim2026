-- Insert sample events (let PostgreSQL generate UUIDs)
DO $$
DECLARE
	hifa_id UUID;
	vf_carnival_id UUID;
	bulawayo_market_id UUID;
	marathon_id UUID;
	fishing_id UUID;
BEGIN
	-- Insert HIFA and get ID
	INSERT INTO public.events (name, description, location, venue, start_date, start_time, end_time, ticket_price, rating, total_ratings, currency, category, tags, organizer, capacity, tickets_available, age_restriction, accessibility, featured, images)
	VALUES ('Harare International Festival of Arts', 'Zimbabwe''s premier arts festival featuring theatre, music, dance, poetry, and visual arts. A celebration of African creativity and culture with local and international artists.', 'Harare', 'Various Venues across Harare', '2025-04-28T09:00:00Z', '09:00', '22:00', 35.00, 4.7, 342, 'USD', 'Festival', ARRAY['Arts', 'Culture', 'Music', 'Theatre', 'Multi-day'], '{"name": "HIFA Trust", "contact": "+263 4 708478", "verified": true}'::jsonb, 5000, 3200, 'All Ages', ARRAY['Wheelchair Accessible', 'Sign Language Interpreter'], TRUE, ARRAY['https://picsum.photos/800/600?random=301', 'https://picsum.photos/800/600?random=302'])
	RETURNING id INTO hifa_id;
	
	-- Insert Victoria Falls Carnival
	INSERT INTO public.events (name, description, location, venue, start_date, start_time, end_time, ticket_price, rating, total_ratings, currency, category, tags, organizer, capacity, tickets_available, age_restriction, accessibility, featured, images)
	VALUES ('Victoria Falls Carnival', 'Annual music and cultural festival at the stunning Victoria Falls. Features top African artists, local bands, and cultural performances with the Falls as your backdrop.', 'Victoria Falls', 'Victoria Falls Amphitheatre', '2025-12-31T16:00:00Z', '16:00', '02:00', 75.00, 4.8, 567, 'USD', 'Music', ARRAY['Music', 'Festival', 'New Year', 'Outdoor'], '{"name": "VF Events Ltd", "contact": "+263 13 44737", "verified": true}'::jsonb, 8000, 4500, '18+', ARRAY['Wheelchair Accessible', 'Medical Station', 'Water Stations'], TRUE, ARRAY['https://picsum.photos/800/600?random=311', 'https://picsum.photos/800/600?random=312'])
	RETURNING id INTO vf_carnival_id;
	
	-- Insert Bulawayo Arts Market
	INSERT INTO public.events (name, description, location, venue, start_date, start_time, end_time, ticket_price, rating, total_ratings, currency, category, tags, organizer, capacity, tickets_available, age_restriction, accessibility, featured, images)
	VALUES ('Bulawayo Arts & Crafts Market', 'Monthly artisan market showcasing local crafts, art, jewelry, and handmade goods. Support local artists and craftspeople while enjoying live music and food.', 'Bulawayo', 'Centenary Park', '2025-11-23T08:00:00Z', '08:00', '17:00', 5.00, 4.5, 128, 'USD', 'Market', ARRAY['Arts', 'Crafts', 'Shopping', 'Family Friendly'], '{"name": "Bulawayo Arts Association", "contact": "+263 9 76543", "verified": true}'::jsonb, 2000, 1800, 'All Ages', ARRAY['Wheelchair Accessible', 'Family Restrooms'], FALSE, ARRAY['https://picsum.photos/800/600?random=321', 'https://picsum.photos/800/600?random=322'])
	RETURNING id INTO bulawayo_market_id;
	
	-- Insert Great Zimbabwe Marathon
	INSERT INTO public.events (name, description, location, venue, start_date, start_time, end_time, ticket_price, rating, total_ratings, currency, category, tags, organizer, capacity, tickets_available, age_restriction, accessibility, featured, images)
	VALUES ('Great Zimbabwe Marathon', 'Run through history! A marathon around the ancient Great Zimbabwe ruins. Choose from 5km, 10km, 21km, or full 42km routes through this UNESCO World Heritage Site.', 'Masvingo', 'Great Zimbabwe Monument', '2025-06-15T06:00:00Z', '06:00', '12:00', 25.00, 4.6, 234, 'USD', 'Sports', ARRAY['Marathon', 'Sports', 'Heritage', 'Outdoor'], '{"name": "Zimbabwe Athletics", "contact": "+263 39 262828", "verified": true}'::jsonb, 1500, 800, 'All Ages', ARRAY['Medical Station', 'Water Stations', 'Wheelchair Accessible Course'], TRUE, ARRAY['https://picsum.photos/800/600?random=331', 'https://picsum.photos/800/600?random=332'])
	RETURNING id INTO marathon_id;
	
	-- Insert Lake Kariba Fishing Tournament
	INSERT INTO public.events (name, description, location, venue, start_date, start_time, end_time, ticket_price, rating, total_ratings, currency, category, tags, organizer, capacity, tickets_available, age_restriction, accessibility, featured, images)
	VALUES ('Lake Kariba Fishing Tournament', 'Annual fishing competition on beautiful Lake Kariba. Compete for prizes in various categories including tiger fish, bream, and catch-and-release.', 'Kariba', 'Lake Kariba Marina', '2025-08-10T05:00:00Z', '05:00', '18:00', 150.00, 4.4, 89, 'USD', 'Sports', ARRAY['Fishing', 'Sports', 'Competition', 'Outdoor'], '{"name": "Kariba Angling Club", "contact": "+263 61 2345", "verified": true}'::jsonb, 200, 120, 'All Ages', ARRAY['Boat Access', 'First Aid Available'], FALSE, ARRAY['https://picsum.photos/800/600?random=341', 'https://picsum.photos/800/600?random=342'])
	RETURNING id INTO fishing_id;
	
	-- Insert tickets for HIFA
	INSERT INTO public.event_tickets (event_id, ticket_type, name, description, base_price, original_price, total_tickets, tickets_sold, perks, sale_start_date, sale_end_date, is_active)
	VALUES 
	(hifa_id, 'early_bird', 'Early Bird Pass', 'Limited early bird pricing for full festival access', 25.00, 35.00, 500, 500, ARRAY['Full Festival Access', 'Priority Entry', 'Festival Guide'], '2025-01-01T00:00:00Z', '2025-02-28T23:59:59Z', FALSE),
	(hifa_id, 'general_admission', 'General Admission', 'Standard festival pass with access to all venues', 35.00, NULL, 2000, 1200, ARRAY['Full Festival Access', 'Festival Guide'], '2025-03-01T00:00:00Z', '2025-04-28T09:00:00Z', TRUE),
	(hifa_id, 'vip', 'VIP Pass', 'Premium experience with backstage access and VIP lounge', 85.00, NULL, 300, 100, ARRAY['Full Festival Access', 'Backstage Access', 'VIP Lounge', 'Meet & Greet', 'Free Drinks', 'Festival Merchandise'], '2025-03-01T00:00:00Z', '2025-04-28T09:00:00Z', TRUE);
	
	-- Insert tickets for Victoria Falls Carnival
	INSERT INTO public.event_tickets (event_id, ticket_type, name, description, base_price, total_tickets, tickets_sold, perks, is_active)
	VALUES 
	(vf_carnival_id, 'general_admission', 'General Admission', 'Standard entry to the carnival grounds', 75.00, 5000, 2500, ARRAY['Event Access', 'Free Water Bottle'], TRUE),
	(vf_carnival_id, 'vip', 'VIP Experience', 'Premium viewing area with bar access', 150.00, 1000, 600, ARRAY['Event Access', 'VIP Area', 'Dedicated Bar', 'Fast Track Entry', 'VIP Restrooms'], TRUE),
	(vf_carnival_id, 'platinum', 'Platinum Package', 'Ultimate experience with backstage access and champagne', 300.00, 200, 100, ARRAY['Event Access', 'Platinum Lounge', 'Backstage Access', 'Champagne Service', 'Meet Artists', 'Exclusive Merchandise', 'Private Restrooms'], TRUE);
	
	-- Insert tickets for Bulawayo Arts Market
	INSERT INTO public.event_tickets (event_id, ticket_type, name, description, base_price, total_tickets, perks, is_active)
	VALUES (bulawayo_market_id, 'general_admission', 'Entry Fee', 'Access to the arts and crafts market', 5.00, NULL, ARRAY['Market Access'], TRUE);
	
	-- Insert tickets for Great Zimbabwe Marathon
	INSERT INTO public.event_tickets (event_id, ticket_type, name, description, base_price, total_tickets, tickets_sold, perks, is_active)
	VALUES 
	(marathon_id, '5km', '5km Fun Run', 'Short family-friendly route', 15.00, 400, 250, ARRAY['Medal', 'T-Shirt', 'Refreshments', 'Certificate'], TRUE),
	(marathon_id, '10km', '10km Race', 'Intermediate distance race', 20.00, 300, 180, ARRAY['Medal', 'T-Shirt', 'Refreshments', 'Certificate', 'Timing Chip'], TRUE),
	(marathon_id, 'half_marathon', '21km Half Marathon', 'Half marathon through historic site', 25.00, 200, 120, ARRAY['Medal', 'T-Shirt', 'Refreshments', 'Certificate', 'Timing Chip', 'Finisher Photos'], TRUE),
	(marathon_id, 'full_marathon', '42km Full Marathon', 'Complete marathon challenge', 30.00, 150, 80, ARRAY['Medal', 'T-Shirt', 'Refreshments', 'Certificate', 'Timing Chip', 'Finisher Photos', 'Marathon Jacket'], TRUE);
	
	-- Insert tickets for Lake Kariba Fishing Tournament
	INSERT INTO public.event_tickets (event_id, ticket_type, name, description, base_price, total_tickets, tickets_sold, perks, is_active)
	VALUES 
	(fishing_id, 'individual', 'Individual Entry', 'Single angler entry', 150.00, 150, 90, ARRAY['Tournament Entry', 'Prize Eligibility', 'Tackle Bag', 'Lunch', 'Certificate'], TRUE),
	(fishing_id, 'team', 'Team Entry (3 people)', 'Team of three anglers', 400.00, 30, 20, ARRAY['Tournament Entry', 'Prize Eligibility', 'Tackle Bags', 'Lunch', 'Team Trophy Eligibility', 'Certificates'], TRUE);
	
	-- Insert gallery images for HIFA
	INSERT INTO public.event_gallery (event_id, image_url, caption, category, is_featured, sort_order)
	VALUES 
	(hifa_id, 'https://picsum.photos/800/600?random=401', 'Main stage performance', 'stage', TRUE, 1),
	(hifa_id, 'https://picsum.photos/800/600?random=402', 'Dance performance', 'performer', TRUE, 2),
	(hifa_id, 'https://picsum.photos/800/600?random=403', 'Art exhibition', 'venue', FALSE, 3),
	(hifa_id, 'https://picsum.photos/800/600?random=404', 'Poetry reading', 'performer', FALSE, 4),
	(hifa_id, 'https://picsum.photos/800/600?random=405', 'Festival crowd', 'promo', FALSE, 5);
	
	-- Insert gallery images for Victoria Falls Carnival
	INSERT INTO public.event_gallery (event_id, image_url, caption, category, is_featured, sort_order)
	VALUES 
	(vf_carnival_id, 'https://picsum.photos/800/600?random=411', 'Carnival stage at sunset', 'stage', TRUE, 1),
	(vf_carnival_id, 'https://picsum.photos/800/600?random=412', 'Headliner performance', 'performer', TRUE, 2),
	(vf_carnival_id, 'https://picsum.photos/800/600?random=413', 'Victoria Falls backdrop', 'venue', TRUE, 3),
	(vf_carnival_id, 'https://picsum.photos/800/600?random=414', 'Festival crowd dancing', 'promo', FALSE, 4),
	(vf_carnival_id, 'https://picsum.photos/800/600?random=415', 'VIP lounge area', 'venue', FALSE, 5);
	
	-- Insert gallery images for Bulawayo Arts Market
	INSERT INTO public.event_gallery (event_id, image_url, caption, category, is_featured, sort_order)
	VALUES 
	(bulawayo_market_id, 'https://picsum.photos/800/600?random=421', 'Market stalls overview', 'venue', TRUE, 1),
	(bulawayo_market_id, 'https://picsum.photos/800/600?random=422', 'Local crafts display', 'promo', FALSE, 2),
	(bulawayo_market_id, 'https://picsum.photos/800/600?random=423', 'Artists at work', 'performer', FALSE, 3);
	
	-- Insert gallery images for Great Zimbabwe Marathon
	INSERT INTO public.event_gallery (event_id, image_url, caption, category, is_featured, sort_order)
	VALUES 
	(marathon_id, 'https://picsum.photos/800/600?random=431', 'Marathon start line', 'venue', TRUE, 1),
	(marathon_id, 'https://picsum.photos/800/600?random=432', 'Runners at Great Zimbabwe ruins', 'promo', TRUE, 2),
	(marathon_id, 'https://picsum.photos/800/600?random=433', 'Marathon finish line', 'venue', FALSE, 3),
	(marathon_id, 'https://picsum.photos/800/600?random=434', 'Previous year winners', 'previous_event', FALSE, 4);
	
	-- Insert gallery images for Lake Kariba Fishing Tournament
	INSERT INTO public.event_gallery (event_id, image_url, caption, category, is_featured, sort_order)
	VALUES 
	(fishing_id, 'https://picsum.photos/800/600?random=441', 'Lake Kariba at sunrise', 'venue', TRUE, 1),
	(fishing_id, 'https://picsum.photos/800/600?random=442', 'Tournament participants', 'promo', FALSE, 2),
	(fishing_id, 'https://picsum.photos/800/600?random=443', 'Prize catch display', 'previous_event', TRUE, 3);
	
	RAISE NOTICE 'Successfully inserted 5 events with tickets and gallery images';
END $$;
