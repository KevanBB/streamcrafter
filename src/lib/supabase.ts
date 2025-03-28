import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wtwpjyqrxqfynjgfvvjw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0d3BqeXFyeHFmeW5qZ2Z2dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDc5MTQsImV4cCI6MjA1ODcyMzkxNH0.quDyJ_E55VEar7azcf0SfXmDjoTi36IOfXIW__ZDcmA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 