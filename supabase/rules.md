# Supabase Security Rules Guidelines

This document provides guidelines and step-by-step instructions to verify and update Row Level Security (RLS) policies and other security rules in Supabase. It is intended as a reference for developers and administrators to ensure that the data access rules are configured appropriately.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Verifying Row Level Security (RLS)](#verifying-rls)
3. [Checking Policies on Key Tables](#checking-policies-on-key-tables)
4. [Verifying the Usage of the is_admin Function](#verifying-the-usage-of-the-is_admin-function)
5. [Updating and Troubleshooting RLS Policies](#updating-and-troubleshooting-rls-policies)
6. [Additional Resources](#additional-resources)

---

## Introduction

Supabase uses PostgreSQL RLS policies to control how data is accessed and modified at the row level. This document outlines the process for verifying that RLS is enabled on key tables and that the associated policies correctly enforce access control using functions such as `is_admin`.

---

## Verifying Row Level Security (RLS)

1. **Access the Supabase Dashboard**  
   Log in to your Supabase account and navigate to your project dashboard.

2. **Locate the Database Section**  
   In the left-hand sidebar, click on the "Database" section to access the tables, views, and functions.

3. **Verify RLS is Enabled Globally**  
   Check the project settings or the database configuration to ensure that RLS has been enabled. RLS is typically enabled in the table settings for each table.

---

## Checking Policies on Key Tables

Ensure that RLS is enabled and that there are appropriate policies in place for the following critical tables:

- **Profiles**  
  Verify that the `profiles` table has RLS enabled. Inspect existing policies to confirm restrictions on updating sensitive fields (such as `is_admin`).

- **Posts**  
  Check the `posts` table to ensure that only authorized users can view or modify posts based on their roles and visibility settings.

- **Shops**  
  For the `shops` table, confirm that RLS is active and that any policies match the intended access controls for shop-related data.

- **Challenges**  
  Inspect the `challenges` table and related tables (such as `challenge_participants` and `challenge_votes`) to ensure that the RLS policies properly limit access based on user roles and challenge status.

To view and edit policies in Supabase:

- Click on a table (e.g., `profiles`) in the dashboard.
- Navigate to the "RLS Policies" tab.
- Review each policy to ensure they include the necessary conditions on columns like `id`, `is_admin`, and any other relevant fields.
- Use the SQL editor if any manual adjustments are needed.

---

## Verifying the Usage of the is_admin Function

The `is_admin` function plays a key role in determining administrative privileges:

1. **Function Overview**  
   The function `public.is_admin(user_id UUID)` returns a boolean value indicating whether the user is an administrator. It retrieves the `is_admin` flag from the `profiles` table for the provided user ID.

2. **Policy Integration**  
   When inspecting RLS policies on key tables, check that conditions refer to the `is_admin` function. For instance, a policy might include a condition like:
   
   ```
   USING (public.is_admin(auth.uid()) OR <other conditions>)
   ```
   
   This ensures that users with administrative roles bypass certain restrictions.

3. **Testing the Functionality**  
   - Execute a test query using the Supabase SQL editor to call the `is_admin` function with a known user ID.
   - Confirm that the function returns the expected boolean value.
   - Validate that application routes and features (such as the admin layout) rely on this function to enforce access restrictions.

---

## Updating and Troubleshooting RLS Policies

1. **Making Updates**  
   - Use the Supabase SQL editor or a migration script to update existing policies.
   - Common updates might include adding additional conditions to limit access or expanding policies for new relational tables.

2. **Testing Changes**  
   - After making any changes, thoroughly test the new policies by simulating various user roles.
   - Use the Supabase dashboard to review the effect of the policy modifications on data access.

3. **Troubleshooting**  
   - Ensure that the policies do not unintentionally block legitimate access.
   - Check the Supabase logs and error messages if access issues arise.
   - Verify that the `is_admin` function is not returning unexpected values due to data inconsistencies.

---

## Additional Resources

- [Supabase Documentation: Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase SQL Editor Documentation](https://supabase.com/docs/guides/database/overview)

---

This document should be updated as policies evolve or new tables are introduced. Regular reviews help ensure that security measures remain robust and aligned with application requirements.
