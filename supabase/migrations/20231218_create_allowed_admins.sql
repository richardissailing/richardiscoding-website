-- Create the allowed_admins table
CREATE TABLE IF NOT EXISTS public.allowed_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.allowed_admins ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to read the table
CREATE POLICY "Allow authenticated users to read allowed_admins" ON public.allowed_admins
    FOR SELECT TO authenticated
    USING (true);

-- Create function to check if email is allowed
CREATE OR REPLACE FUNCTION public.is_admin_email(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.allowed_admins
        WHERE email = check_email
    );
END;
$$;

-- Create trigger to sync with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM public.allowed_admins 
    WHERE email = NEW.email
  ) THEN
    RETURN NEW;
  ELSE
    -- If email is not in allowed_admins, prevent creation
    RAISE EXCEPTION 'Email not authorized';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to auth.users table
DROP TRIGGER IF EXISTS ensure_user_is_admin ON auth.users;
CREATE TRIGGER ensure_user_is_admin
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
