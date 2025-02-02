-- Migration: 20231101_create_is_admin_function.sql
-- This migration creates the 'is_admin' function in the Supabase PostgreSQL database.
-- The function accepts a user_id (UUID) as its parameter, queries the 'profiles' table to retrieve
-- the corresponding 'is_admin' flag, and returns a boolean value indicating whether the user is an admin.

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS boolean
AS $$
DECLARE
  admin_flag boolean;
BEGIN
    SELECT COALESCE(is_admin, false)
      INTO admin_flag
      FROM public.profiles
     WHERE id = user_id;
     
    RETURN admin_flag;
END;
$$ LANGUAGE plpgsql VOLATILE;