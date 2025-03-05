
-- Update module_status to include 'maintenance'
ALTER TYPE module_status ADD VALUE IF NOT EXISTS 'maintenance';
