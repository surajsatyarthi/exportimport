import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://houzcaefzyxpuigazrvz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdXpjYWVmenl4cHVpZ2F6cnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzI4OTMsImV4cCI6MjA2ODQ0ODg5M30.CDfHn_42zdRo99LJz1qS6qTYMk0EGX-kcrbVn2cbS9A'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)