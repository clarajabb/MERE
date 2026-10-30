/**
 * Public Supabase connection values. Both are safe to expose to the browser:
 * access to data is enforced by Row Level Security, not by these values.
 * The service-role key is intentionally never read anywhere in this app.
 */
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (and in Vercel → Settings → Environment Variables).",
    );
  }
  return { url, key };
}
