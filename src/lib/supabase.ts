import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Browser client for authentication and real-time
export const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Server-side client (for API routes)
export const getSupabaseServerClient = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);
};

// Client for authenticated requests
export async function supabaseAuth() {
  const client = getSupabaseClient();
  const {
    data: { session },
  } = await client.auth.getSession();
  return session;
}
