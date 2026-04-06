-- Add sample featured destinations data
INSERT INTO public.destinations (name, description, location, image_url, weather, featured, category, price_range, rating) VALUES
  ('Victoria Falls', 'One of the largest waterfalls in the world', 'Victoria Falls', 'https://picsum.photos/800/600?random=falls1', '🌦️ 28°C', true, 'Nature', '$$$', 4.9),
  ('Hwange National Park', 'Zimbabwe''s largest game reserve with abundant wildlife', 'Hwange', 'https://picsum.photos/800/600?random=safari1', '☀️ 31°C', true, 'Wildlife', '$$', 4.7),
  ('Great Zimbabwe', 'Ancient city ruins and UNESCO World Heritage Site', 'Masvingo', 'https://picsum.photos/800/600?random=ruins1', '⛅ 26°C', true, 'Cultural', '$', 4.5),
  ('Eastern Highlands', 'Mountain ranges with cool climate and scenic views', 'Nyanga', 'https://picsum.photos/800/600?random=mountains1', '🌤️ 22°C', true, 'Nature', '$$', 4.6),
  ('Mana Pools', 'UNESCO World Heritage Site famous for walking safaris', 'Mana Pools', 'https://picsum.photos/800/600?random=mana1', '🌦️ 30°C', true, 'Wildlife', '$$$', 4.8),
  ('Lake Kariba', 'One of the world''s largest man-made lakes', 'Kariba', 'https://picsum.photos/800/600?random=lake1', '🌧️ 29°C', true, 'Water Sports', '$$', 4.4),
  ('Harare', 'Capital city with modern amenities and cultural sites', 'Harare', 'https://picsum.photos/800/600?random=city1', '☀️ 25°C', true, 'Urban', '$$', 4.2),
  ('Bulawayo', 'Industrial city with rich history and museums', 'Bulawayo', 'https://picsum.photos/800/600?random=city2', '⛅ 23°C', true, 'Urban', '$', 4.1);

-- Verify the data
SELECT name, location, weather, featured FROM public.destinations WHERE featured = true ORDER BY name;