import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only internal routes. The public landing page never touches Supabase.
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
