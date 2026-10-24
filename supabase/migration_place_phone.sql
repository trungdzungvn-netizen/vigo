-- ViGo: phone number for delivery and contact buttons
ALTER TABLE public.places
ADD COLUMN IF NOT EXISTS phone TEXT;

COMMENT ON COLUMN public.places.phone IS
'Public contact phone number used by the call and delivery tel: buttons.';
