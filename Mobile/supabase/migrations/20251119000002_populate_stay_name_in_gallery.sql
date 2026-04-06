-- Populate stay_name in stay_gallery based on stay_id
UPDATE public.stay_gallery
SET stay_name = stays.name
FROM public.stays
WHERE stay_gallery.stay_id = stays.id;
