// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jvmmgamfdbgdjjptfkgy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bW1nYW1mZGJnZGpqcHRma2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMzk5NjAsImV4cCI6MjA1MzYxNTk2MH0._51Uk0LRRB-r2UI7bJZp0rpotbxage6hULlPrWZhskk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);