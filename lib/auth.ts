import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "ADMIN" | "REVIEWER" | "DATA_ENTRY";

export type Staff = {
  id: string;
  email: string;
  fullName: string | null;
  role: StaffRole;
};

type StaffCheck =
  | { ok: true; staff: Staff }
  | { ok: false; reason: "signed-out" | "no-profile" | "inactive" };

/**
 * The authorization check for every internal page. Verifies the session JWT
 * on the server, then requires an *active* row in `profiles` — the same
 * condition the database's RLS policies use via get_current_user_role().
 * Memoised per request so layouts and pages can both call it cheaply.
 */
export const checkStaff = cache(async (): Promise<StaffCheck> => {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (error || !userId) return { ok: false, reason: "signed-out" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, active")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return { ok: false, reason: "no-profile" };
  if (!profile.active) return { ok: false, reason: "inactive" };

  return {
    ok: true,
    staff: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role as StaffRole,
    },
  };
});

/** Use at the top of every internal page and server action. */
export async function requireStaff(): Promise<Staff> {
  const result = await checkStaff();
  if (!result.ok) {
    redirect(result.reason === "signed-out" ? "/login" : `/login?error=${result.reason}`);
  }
  return result.staff;
}
