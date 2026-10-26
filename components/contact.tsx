import { mailto, site } from "@/lib/site";
import { Arrow, ButtonLink } from "@/components/ui";

const audiences = ["Laboratories", "Material specialists", "Manufacturers", "Brands"];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 sm:py-36">
      <div className="container-page">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-forest">05</span>
          <span aria-hidden="true" className="h-px w-8 bg-rule-strong" />
          <span>Contact</span>
        </p>
        <h2
          id="contact-heading"
          className="mt-6 max-w-4xl font-serif text-[2.5rem] leading-[1.04] font-light tracking-[-0.025em] text-ink sm:text-6xl lg:text-[4.5rem]"
        >
          Help shape a more transparent <em className="font-normal text-forest">materials industry.</em>
        </h2>

        <div className="mt-12 grid gap-10 border-t border-rule pt-10 lg:grid-cols-12">
          <p className="max-w-xl text-lg leading-relaxed text-graphite lg:col-span-6">
            We&rsquo;re developing MERE and welcome conversations with laboratories, material
            specialists, manufacturers, brands, and others interested in scientific material
            verification.
          </p>

          <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <ul className="flex flex-wrap gap-2" aria-label="Who we would like to hear from">
              {audiences.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-rule-strong px-3 py-1 text-xs text-graphite"
                >
                  {a}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <ButtonLink href={mailto} className="px-6 py-3">
                Contact MERE
                <Arrow />
              </ButtonLink>
              <a
                href={mailto}
                className="font-mono text-sm text-graphite underline decoration-rule-strong underline-offset-4 transition-colors hover:text-forest hover:decoration-forest"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
