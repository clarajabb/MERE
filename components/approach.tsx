const steps = [
  {
    verb: "Register",
    body: "Create a structured identity for a material or batch.",
  },
  {
    verb: "Document",
    body: "Associate scientific measurements, testing methods, and supporting documentation.",
  },
  {
    verb: "Evaluate",
    body: "Support a controlled review process that distinguishes unverified claims from reviewed evidence.",
  },
  {
    verb: "Communicate",
    body: "Present material characteristics through a clear, traceable digital profile.",
  },
];

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="bg-forest-deep py-24 text-ivory sm:py-32"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-ivory/60">
              <span className="text-sage">02</span>
              <span aria-hidden="true" className="h-px w-8 bg-ivory/25" />
              <span>Our Approach</span>
            </p>
            <h2
              id="approach-heading"
              className="mt-6 max-w-3xl font-serif text-[2.125rem] leading-[1.08] font-normal tracking-[-0.015em] sm:text-5xl lg:text-[3.5rem]"
            >
              From material data to scientific clarity.
            </h2>
          </div>
          <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ivory/75 lg:col-span-5 lg:pt-16">
            <p>
              MERE is designing a platform that brings testing data, methods and documentation
              together into a single structured record — and keeps a clear line between what has
              been declared and what has been reviewed.
            </p>
            <p className="font-mono text-xs tracking-wide text-ivory/50 uppercase">
              Proposed workflow · Not yet available to customers
            </p>
          </div>
        </div>

        <ol className="relative mt-20 grid gap-0 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.verb} className="relative border-t border-ivory/20 pt-8 pb-10 sm:pr-8 lg:pb-0">
              <span
                aria-hidden="true"
                className="absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full border border-sage bg-forest-deep"
              />
              <span className="font-mono text-xs text-sage">Step 0{i + 1}</span>
              <h3 className="mt-4 font-serif text-[1.875rem] leading-tight">{s.verb}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-ivory/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
