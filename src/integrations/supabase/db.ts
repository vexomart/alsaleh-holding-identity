/**
 * Database query helper that bypasses strict type checking for tables not yet in schema.
 * This is a temporary workaround until the database schema is properly set up.
 */

import { supabase } from './client';

// Create a typed database client that bypasses strict type checking
const db = supabase as any;

export { db };
export { supabase };
