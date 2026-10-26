import { demoDisclaimer, demoProfile } from "@/lib/demo-profile";
import { SectionHeading } from "@/components/ui";

const annotations = [
  { n: "A", title: "Identity", body: "A persistent identifier for a specific material or batch." },
  { n: "B", title: "Measurements", body: "Characteristics recorded with explicit values and units." },
  { n: "C", title: "Review status", body: "Every value carries its status — nothing is presented as verified by default." },
  { n: "D", title: "Evidence trail", body: "Methods, reports and documents linked to the values they support." },
];

export function MaterialProfile() {
  return (
    <section id="profile" aria-labelledby="profile-heading" className="py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            index="03"
            label="Example Material Profile"
            id="profile-heading"
            className="lg:col-span-7"
          >
            What a material record could look like.
          </SectionHeading>
          <p className="text-[1.0625rem] leading-relaxed text-graphite lg:col-span-5 lg:pt-16">
            A demonstration of the structured, traceable profile MERE is developing. The record
            below uses hardcoded example values and is shown in its draft state.
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          <ol className="order-2 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:order-1 lg:col-span-3 lg:grid-cols-1 lg:content-start lg:pt-24">
            {annotations.map((a) => (
              <li key={a.n} className="flex gap-4">
                <Marker>{a.n}</Marker>
                <div>
                  <h3 className="text-sm font-medium text-ink">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{a.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="order-1 lg:order-2 lg:col-span-9">
            <ProfileCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileCard() {
  const p = demoProfile;
  return (
    <article
      aria-label={`Demonstration material profile ${p.id}`}
      className="relative border border-rule-strong bg-paper shadow-[0_1px_0_rgba(23,25,26,0.04),0_24px_48px_-28px_rgba(23,25,26,0.25)]"
    >
      {/* Disclaimer */}
      <div
        role="note"
        className="flex items-start gap-3 border-b border-rule-strong bg-[repeating-linear-gradient(135deg,var(--color-ivory)_0_10px,var(--color-paper)_10px_20px)] px-5 py-4 sm:items-center sm:px-8"
      >
        <span className="mt-0.5 shrink-0 rounded-sm border border-ink px-1.5 py-0.5 font-mono text-[0.625rem] font-medium tracking-[0.14em] text-ink sm:mt-0">
          DEMO
        </span>
        <p className="text-sm leading-snug font-medium text-ink">{demoDisclaimer}</p>
      </div>

      {/* Identity */}
      <header className="relative px-5 pt-8 pb-7 sm:px-8 sm:pt-10">
        <span className="absolute top-8 right-5 hidden sm:right-8 sm:block">
          <Marker>A</Marker>
        </span>
        <p className="eyebrow">Material record</p>
        <p className="mt-3 font-mono text-xl tracking-tight text-ink sm:text-2xl">{p.id}</p>
        <h3 className="mt-4 max-w-xl font-serif text-[1.625rem] leading-tight text-ink sm:text-[2rem]">
          {p.material}
        </h3>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-4">
          <Meta label="Category" value={p.category} />
          <Meta label="Stage" value={p.stage} />
          <div className="col-span-2 bg-paper px-4 py-3.5">
            <dt className="eyebrow text-[0.625rem]">Status</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-sm text-ink">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-dashed border-muted" />
              {p.status}
            </dd>
          </div>
        </dl>
      </header>

      {/* Measurements */}
      <div className="relative border-t border-rule px-5 py-8 sm:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="eyebrow text-ink">Measurements</h4>
          <span className="hidden sm:block"><Marker>B</Marker></span>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule min-[480px]:grid-cols-2 md:grid-cols-3">
          {p.measurements.map((m) => (
            <li key={m.parameter} className="flex flex-col justify-between gap-6 bg-paper p-5">
              <p className="text-[0.8125rem] leading-snug text-muted">{m.parameter}</p>
              <div>
                <p className="flex items-baseline gap-1.5 text-ink">
                  <span className="font-serif text-[2.5rem] leading-none font-light tracking-tight tabular-nums">
                    {m.value}
                  </span>
                  <span className="font-mono text-sm text-graphite">{m.unit}</span>
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-faint" />
                  Not reviewed · Illustrative
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Evidence trail */}
      <div className="border-t border-rule px-5 py-8 sm:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="eyebrow text-ink">Evidence trail</h4>
          <span className="hidden gap-2 sm:flex"><Marker>C</Marker><Marker>D</Marker></span>
        </div>
        <dl className="mt-4 divide-y divide-rule border-y border-rule">
          {p.evidence.map((e) => (
            <div key={e.item} className="flex items-center justify-between gap-4 py-3.5 text-sm">
              <dt className="text-graphite">{e.item}</dt>
              <dd className="font-mono text-xs text-muted">{e.state}</dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="flex flex-col gap-1 border-t border-rule px-5 py-4 font-mono text-[0.6875rem] text-faint sm:flex-row sm:justify-between sm:px-8">
        <span>Record type: demonstration</span>
        <span>Data source: hardcoded example values</span>
      </footer>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-4 py-3.5">
      <dt className="eyebrow text-[0.625rem]">{label}</dt>
      <dd className="mt-1.5 text-sm text-ink">{value}</dd>
    </div>
  );
}

function Marker({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-forest font-mono text-[0.6875rem] text-forest"
    >
      {children}
    </span>
  );
}
