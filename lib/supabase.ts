import { createClient } from '@supabase/supabase-js'

// Use the Supabase credentials provided by the user.
// In a production environment, it's recommended to use environment variables for security.
const supabaseUrl = 'https://fbfxemdoolnnljoulzzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZnhlbWRvb2xubmxqb3VsenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODk2MjEsImV4cCI6MjA3NDM2NTYyMX0.02g7YN4T8n2T7V8JakyQDXoXBdh_RMvqW5AJFchq3eM';

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL and Key are missing.");
    // In a real app, you might want to show an error to the user or disable DB features.
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
