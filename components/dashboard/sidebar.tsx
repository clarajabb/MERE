import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";
import { Monogram } from "@/components/ui";
import type { Staff } from "@/lib/auth";
import { label } from "@/lib/format";

export function Sidebar({ staff }: { staff: Staff }) {
  const name = staff.fullName?.trim() || staff.email;
  return (
    <aside className="flex flex-col border-b border-rule bg-paper lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6 lg:py-7">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-ink" aria-label="MERE dashboard">
          <Monogram className="h-5 w-5 text-forest" />
          <span className="font-serif text-[1.25rem] leading-none tracking-[0.2em]">MERE</span>
        </Link>
        <span className="eyebrow text-[0.625rem]">Internal</span>
      </div>

      <nav aria-label="Dashboard" className="px-3 pb-3 lg:px-4 lg:pt-4">
        <p className="eyebrow hidden px-3 pb-3 text-[0.625rem] lg:block">Registry</p>
        <ul className="flex gap-1 lg:flex-col">
          <li>
            <Link
              href="/dashboard"
              aria-current="page"
              className="flex items-center gap-3 rounded-md bg-ivory px-3 py-2 text-sm font-medium text-ink ring-1 ring-rule"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 text-forest" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="8" cy="8" r="5.5" />
                <path d="M2.5 8h11" />
              </svg>
              Materials
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto hidden border-t border-rule px-6 py-6 lg:block">
        <UserPanel name={name} email={staff.email} role={staff.role} />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-rule px-5 py-3 lg:hidden">
        <p className="min-w-0 truncate text-xs text-muted">
          {name} · {label(staff.role)}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}

function UserPanel({ name, email, role }: { name: string; email: string; role: string }) {
  return (
    <div>
      <p className="eyebrow text-[0.625rem]">Signed in</p>
      <p className="mt-2 truncate text-sm font-medium text-ink" title={name}>
        {name}
      </p>
      {name !== email && (
        <p className="truncate text-xs text-muted" title={email}>
          {email}
        </p>
      )}
      <p className="mt-2 inline-flex rounded-sm bg-sage-soft px-1.5 py-0.5 font-mono text-[0.625rem] tracking-[0.1em] text-forest uppercase">
        {label(role)}
      </p>
      <div className="mt-5">
        <SignOutButton />
      </div>
    </div>
  );
}

function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-full border border-rule-strong px-3.5 py-1.5 text-xs text-graphite transition-colors hover:border-ink hover:text-ink"
      >
        Sign out
      </button>
    </form>
  );
}
