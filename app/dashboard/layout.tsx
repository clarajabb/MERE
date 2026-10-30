import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — MERE",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar staff={staff} />
      <main id="main" className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">{children}</div>
      </main>
    </div>
  );
}
