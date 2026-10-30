import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { Monogram } from "@/components/ui";
import { checkStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in — MERE",
  robots: { index: false, follow: false },
};

const notices: Record<string, string> = {
  inactive: "This account is inactive. Contact a MERE administrator to restore access.",
  "no-profile": "This account does not have MERE staff access.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const result = await checkStaff();
  if (result.ok) redirect("/dashboard");

  const { error } = await searchParams;
  const notice = (error && notices[error]) ?? null;

  return (
    <main id="main" className="grid min-h-dvh lg:grid-cols-2">
      <section className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <Link href="/" className="flex w-fit items-center gap-2.5 text-ink" aria-label="MERE home">
          <Monogram className="h-5 w-5 text-forest" />
          <span className="font-serif text-[1.3rem] leading-none tracking-[0.2em]">MERE</span>
        </Link>

        <div className="mx-auto w-full max-w-sm py-16">
          <p className="eyebrow">Staff access</p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-[-0.02em] text-ink">
            Sign in to MERE
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            For authorized MERE staff. Access is limited to active staff accounts.
          </p>
          <div className="mt-10">
            <LoginForm notice={notice} />
          </div>
        </div>

        <p className="font-mono text-[0.6875rem] text-faint">Internal system · In development</p>
      </section>

      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden border-l border-rule bg-forest-deep lg:block"
      >
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 800">
          <defs>
            <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(246,243,236,0.06)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="600" height="800" fill="url(#login-grid)" />
          {Array.from({ length: 18 }, (_, i) => {
            const y = 120 + i * 34;
            return (
              <path
                key={i}
                d={`M-20 ${y} C 180 ${y - 60 + (i % 3) * 30}, 380 ${y - 200 + (i % 4) * 25}, 620 ${y - 260}`}
                fill="none"
                stroke={i === 9 ? "var(--color-sage)" : "rgba(246,243,236,0.22)"}
                strokeWidth={i === 9 ? 1.6 : 0.8}
              />
            );
          })}
        </svg>
        <p className="absolute bottom-10 left-12 max-w-xs font-serif text-2xl leading-snug text-ivory/85">
          Material claims deserve <em className="text-sage">evidence.</em>
        </p>
      </aside>
    </main>
  );
}
