
import { createClient } from '@supabase/supabase-js';

// Helper function to safely retrieve environment variables
// Handles potential issues where process.env might not behave as expected in all environments
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  } catch (e) {
    return undefined;
  }
};

const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Fallback constants to prevent the app from crashing if keys are missing
// The actual service logic checks isSupabaseConfigured() before making calls
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder';

const hasValidEnv = (val: string | undefined): val is string => {
  return !!val && val.trim().length > 0;
};

const supabaseUrl = hasValidEnv(rawUrl) ? rawUrl : FALLBACK_URL;
const supabaseKey = hasValidEnv(rawKey) ? rawKey : FALLBACK_KEY;

export const isSupabaseConfigured = () => {
    return supabaseUrl !== FALLBACK_URL && supabaseKey !== FALLBACK_KEY;
};

export const supabase = createClient(supabaseUrl, supabaseKey);
