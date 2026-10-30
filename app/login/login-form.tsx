"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/login/actions";

const initial: LoginState = { error: null, email: "" };

export function LoginForm({ notice }: { notice: string | null }) {
  const [state, action, pending] = useActionState(signIn, initial);
  const message = state.error ?? notice;

  return (
    <form action={action} className="space-y-5" noValidate>
      {message && (
        <p
          role="alert"
          className="border-l-2 border-[#9a3b2e] bg-[#f6ebe6] px-4 py-3 text-sm leading-snug text-[#7a2f24]"
        >
          {message}
        </p>
      )}

      <Field label="Email address" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          key={state.email}
          className={inputClass}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-forest bg-forest px-5 py-3 text-sm font-medium text-ivory transition-colors hover:border-forest-deep hover:bg-forest-deep disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

const inputClass =
  "block w-full rounded-md border border-rule-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors placeholder:text-faint hover:border-muted focus:border-forest focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-forest/20";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[0.8125rem] font-medium text-graphite">
        {label}
      </label>
      {children}
    </div>
  );
}
