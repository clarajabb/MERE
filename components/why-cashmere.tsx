import { SectionHeading } from "@/components/ui";

const characteristics = [
  { term: "Fiber diameter", detail: "Fineness, typically expressed in microns" },
  { term: "Fiber length", detail: "Staple length of the fiber" },
  { term: "Composition", detail: "Proportion of cashmere relative to other fibers" },
  { term: "Guard hair", detail: "Presence of coarser outer hair" },
  { term: "Foreign matter", detail: "Non-fiber content remaining in the material" },
];

export function WhyCashmere() {
  return (
    <section
      id="cashmere"
      aria-labelledby="cashmere-heading"
      className="border-t border-rule bg-paper py-24 sm:py-32"
    >
      <div className="container-page grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionHeading index="04" label="Why Cashmere" id="cashmere-heading">
            Starting with cashmere. Built for materials beyond it.
          </SectionHeading>
          <div className="mt-10 max-w-xl space-y-5 text-[1.0625rem] leading-relaxed text-graphite">
            <p>
              Cashmere is a natural starting point. Its quality assessment depends on
              characteristics that can be measured — among them fiber diameter, fiber length and
              composition — which makes it well suited to a structured, evidence-based record.
            </p>
            <p>
              MERE&rsquo;s underlying architecture is being designed so that the same
              principles — identity, measurement, method, documentation and review — have the
              potential to extend to other materials over time.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
          <p className="eyebrow">Measurable characteristics</p>
          <dl className="mt-5 border-t border-ink">
            {characteristics.map((c, i) => (
              <div
                key={c.term}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-rule py-5 sm:grid-cols-[2.5rem_11rem_1fr]"
              >
                <span aria-hidden="true" className="font-mono text-xs leading-6 text-forest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="font-serif text-xl leading-6 text-ink">{c.term}</dt>
                <dd className="col-start-2 mt-1 text-sm leading-6 text-muted sm:col-start-3 sm:mt-0">
                  {c.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
