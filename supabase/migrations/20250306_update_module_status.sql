
-- Update module_status to include 'maintenance'
ALTER TYPE module_status ADD VALUE IF NOT EXISTS 'maintenance';

-- Update app_modules table if needed to allow maintenance status
ALTER TABLE public.app_modules ALTER COLUMN status TYPE module_status USING status::module_status;
