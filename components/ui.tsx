import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-ivory hover:bg-forest-deep border border-forest hover:border-forest-deep",
  secondary:
    "border border-rule-strong text-ink hover:border-ink bg-transparent",
  quiet: "border border-transparent text-ink hover:text-forest",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-tight transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 ${direction === "down" ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/** A circle bisected by a measured diameter — MERE's mark. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 12h15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 9.5v5M19.5 9.5v5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function SectionHeading({
  index,
  label,
  id,
  children,
  className = "",
}: {
  index: string;
  label: string;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow flex items-center gap-3">
        <span className="text-forest">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-rule-strong" />
        <span>{label}</span>
      </p>
      <h2
        id={id}
        className="mt-6 max-w-3xl font-serif text-[2.125rem] leading-[1.08] font-normal tracking-[-0.015em] text-ink sm:text-5xl lg:text-[3.5rem]"
      >
        {children}
      </h2>
    </div>
  );
}
