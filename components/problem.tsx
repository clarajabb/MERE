import { SectionHeading } from "@/components/ui";

const themes = [
  {
    title: "Fragmented evidence",
    body: "Testing information is scattered across reports and systems.",
  },
  {
    title: "Limited comparability",
    body: "Different methods and reporting formats make material characteristics difficult to compare.",
  },
  {
    title: "Unclear verification",
    body: "It can be difficult to distinguish supplier-declared information from independently evaluated evidence.",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="border-t border-rule py-24 sm:py-32"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            index="01"
            label="The Problem"
            id="problem-heading"
            className="lg:col-span-7"
          >
            A material claim is not the same as material evidence.
          </SectionHeading>

          <div className="space-y-5 text-[1.0625rem] leading-relaxed text-graphite lg:col-span-5 lg:pt-16">
            <p>
              The quality of premium materials is usually communicated through supplier
              declarations, certificates and laboratory reports. Each may be accurate, yet they
              rarely arrive together, in a consistent structure, or with a clear indication of
              what has been measured and by whom.
            </p>
            <p>
              The result is a record that is difficult to compare, difficult to trace back to its
              source, and difficult to evaluate independently.
            </p>
          </div>
        </div>

        <ClaimVersusEvidence />

        <ol className="mt-20 grid border-t border-ink sm:mt-24 md:grid-cols-3">
          {themes.map((t, i) => (
            <li
              key={t.title}
              className="border-b border-rule py-8 md:border-b-0 md:py-10 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10"
            >
              <span className="font-mono text-xs text-forest">0{i + 1}</span>
              <h3 className="mt-5 font-serif text-2xl leading-snug text-ink sm:text-[1.75rem]">
                {t.title}
              </h3>
              <p className="mt-3 max-w-sm leading-relaxed text-muted">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClaimVersusEvidence() {
  const parts = ["Measured value", "Unit & method", "Source document", "Review status"];
  return (
    <figure className="mt-16 sm:mt-20" aria-label="Comparison of a material claim and structured evidence">
      <div className="grid overflow-hidden border border-rule bg-paper md:grid-cols-2">
        <div className="p-7 sm:p-10">
          <p className="eyebrow">A claim</p>
          <blockquote className="mt-6 font-serif text-2xl leading-snug text-graphite italic sm:text-[1.75rem]">
            “Premium-grade cashmere, exceptionally fine.”
          </blockquote>
          <p className="mt-6 font-mono text-xs text-faint">Source: declaration · Method: — · Review: —</p>
        </div>
        <div className="border-t border-rule p-7 sm:p-10 md:border-t-0 md:border-l">
          <p className="eyebrow text-forest">Structured evidence</p>
          <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule">
            {parts.map((p) => (
              <li key={p} className="bg-paper px-4 py-4 text-sm text-ink">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs text-muted">
            Each characteristic linked to how it was measured and where it came from.
          </p>
        </div>
      </div>
      <figcaption className="sr-only">
        A claim is a statement. Evidence connects a measured value to its method, source and
        review status.
      </figcaption>
    </figure>
  );
}
