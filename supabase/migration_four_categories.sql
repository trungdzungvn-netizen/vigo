-- Run in Supabase SQL Editor on the existing project.
-- Renaming enum values preserves existing rows and references.
ALTER TYPE public.place_category RENAME VALUE 'Quán cà phê' TO 'Cafe';
ALTER TYPE public.place_category RENAME VALUE 'Check-in/Du lịch' TO 'Check-in';
ALTER TYPE public.place_category ADD VALUE IF NOT EXISTS 'Hotel';
