-- Add your email to allowed_admins table
INSERT INTO public.allowed_admins (email)
VALUES ('richard.kirkham@live.com.au')
ON CONFLICT (email) DO NOTHING;
