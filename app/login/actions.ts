"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null; email: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email address and password.", email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: describeAuthError(error?.code, error?.status), email };
  }

  // Signing in is not enough: the account must have an active staff profile.
  const { data: profile } = await supabase
    .from("profiles")
    .select("active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile?.active) {
    await supabase.auth.signOut();
    return {
      error: profile
        ? "This account is inactive. Contact a MERE administrator to restore access."
        : "This account does not have MERE staff access.",
      email,
    };
  }

  redirect("/dashboard");
}

function describeAuthError(code?: string, status?: number) {
  switch (code) {
    case "invalid_credentials":
      return "Incorrect email address or password.";
    case "email_not_confirmed":
      return "This email address has not been confirmed yet.";
    case "user_banned":
      return "This account has been suspended.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  if (status && status >= 500) return "The authentication service is unavailable. Please try again shortly.";
  return "Sign-in failed. Check your details and try again.";
}
