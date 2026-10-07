/**
 * Admin authentication utilities using Supabase Auth.
 * The admin email is a fixed, non-sensitive identifier.
 * The password is verified server-side by Supabase Auth — never stored in frontend code.
 */
import { supabase } from './supabase';

const ADMIN_EMAIL = 'admin@hostelday.local';

export interface AdminLoginResult {
  success: boolean;
  error?: string;
}

/**
 * Log in as admin using Supabase Auth.
 * Password is sent over HTTPS to Supabase servers and compared
 * against the bcrypt hash stored in auth.users — never exposed client-side.
 */
export async function adminLogin(password: string): Promise<AdminLoginResult> {
  if (!supabase) {
    return { success: false, error: 'Database not configured.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  if (error || !data.session) {
    return { success: false, error: 'Incorrect admin password.' };
  }

  return { success: true };
}

/**
 * Log out the admin and destroy the Supabase session.
 */
export async function adminLogout(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Check if an active admin session exists.
 * Returns true if the current Supabase session belongs to the admin account.
 */
export async function getAdminSession(): Promise<boolean> {
  if (!supabase) return false;

  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;

  const user = data.session.user;
  return user?.email === ADMIN_EMAIL;
}

/**
 * Fetch all performance registrations — only accessible via authenticated session (RLS enforced).
 */
export async function fetchAllPerformanceRegistrations() {
  if (!supabase) return { data: [], error: 'Not configured' };

  const { data, error } = await supabase
    .from('performance_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

/**
 * Fetch all food preferences (individual records) — only accessible via authenticated session (RLS enforced).
 */
export async function fetchAllFoodPreferences() {
  if (!supabase) return { data: [], error: 'Not configured' };

  const { data, error } = await supabase
    .from('food_preferences')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

/**
 * Fetch aggregated food preference counts (anon-accessible via SECURITY DEFINER function).
 * This keeps the public food counter working without exposing individual records.
 */
export async function fetchFoodCountsByYearAdmin() {
  if (!supabase) return { data: [], error: 'Not configured' };

  const { data, error } = await supabase.rpc('get_food_preference_counts_by_year');
  return { data: data ?? [], error: error?.message ?? null };
}
