export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-rule pb-8">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="mt-4 font-serif text-[2.25rem] leading-[1.08] font-light tracking-[-0.02em] text-ink sm:text-[2.75rem]">
        {title}
      </h1>
      {children}
    </header>
  );
}

export function QueryError({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-8 border-l-2 border-[#9a3b2e] bg-[#f6ebe6] px-4 py-3 text-sm text-[#7a2f24]">
      Could not load data from Supabase: {message}
    </p>
  );
}
