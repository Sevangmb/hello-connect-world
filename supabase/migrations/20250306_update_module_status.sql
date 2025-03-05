
-- Verify if the module_status type exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'module_status') THEN
        CREATE TYPE module_status AS ENUM ('active', 'inactive', 'degraded', 'maintenance');
    ELSE
        -- Check if 'maintenance' value exists in the type
        IF NOT EXISTS (
            SELECT 1
            FROM pg_enum
            WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'module_status')
            AND enumlabel = 'maintenance'
        ) THEN
            -- If 'maintenance' doesn't exist, add it to the type
            ALTER TYPE module_status ADD VALUE IF NOT EXISTS 'maintenance';
        END IF;
    END IF;
END
$$;

-- Update app_modules table if needed to allow maintenance status
ALTER TABLE public.app_modules ALTER COLUMN status TYPE module_status USING status::module_status;
