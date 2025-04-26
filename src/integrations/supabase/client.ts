
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://rturqgnqhvwjaboztkbi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dXJxZ25xaHZ3amFib3p0a2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDIxOTMsImV4cCI6MjA1NTYxODE5M30.hSZcP4knLLKlAMUiH6ZcdgBdhAzlO6DHHTh17QN9niY';

// Create a single supabase client for the entire app with improved configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    // Adding these options to improve authentication reliability
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        credentials: 'same-origin',
      });
    },
    headers: { 'x-custom-app-header': 'premium-barber-app' },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
});
