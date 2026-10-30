export const inputClass =
  "block w-full rounded-md border border-rule-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors placeholder:text-faint hover:border-muted focus:border-forest focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-forest/20 aria-invalid:border-[#9a3b2e]";

export const fixedValueClass =
  "block w-full cursor-default rounded-md border border-rule bg-transparent px-3.5 py-2.5 text-[0.9375rem] text-graphite focus:outline-none";

export function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule pb-3">
        <span className="eyebrow text-ink">{title}</span>
        {note && <span className="font-mono text-[0.6875rem] text-muted">{note}</span>}
      </legend>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-[0.8125rem] font-medium text-graphite">
        {label}
        {required && <span className="ml-2 font-mono text-[0.625rem] font-normal text-muted">Required</span>}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-2 text-xs text-[#7a2f24]">
          {error}
        </p>
      )}
    </div>
  );
}
