-- Insert sample featured destinations for carousel testing
INSERT INTO public.destinations (name, description, location, image_url, featured, rating, weather, category, price_range) VALUES
  ('Victoria Falls', 'One of the largest waterfalls in the world', 'Victoria Falls', 'https://picsum.photos/800/600?random=1', true, 4.8, '28°C Sunny', 'Natural Wonder', '$50-200'),
  ('Hwange National Park', 'Zimbabwe''s largest game reserve with diverse wildlife', 'Hwange', 'https://picsum.photos/800/600?random=2', true, 4.6, '32°C Clear', 'Wildlife Safari', '$100-400'),
  ('Eastern Highlands', 'Scenic mountain landscapes and hiking trails', 'Mutare', 'https://picsum.photos/800/600?random=3', true, 4.5, '22°C Cool', 'Mountains', '$30-150'),
  ('Great Zimbabwe', 'Ancient stone city and UNESCO World Heritage Site', 'Masvingo', 'https://picsum.photos/800/600?random=4', true, 4.4, '26°C Mild', 'Cultural Heritage', '$20-80'),
  ('Mana Pools', 'UNESCO World Heritage canoe safari destination', 'Urungwe', 'https://picsum.photos/800/600?random=5', true, 4.7, '30°C Warm', 'River Safari', '$150-500');

-- Verify the data was inserted
SELECT name, location, featured FROM public.destinations WHERE featured = true;