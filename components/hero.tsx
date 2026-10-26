import { FiberField } from "@/components/fiber-field";
import { Arrow, ButtonLink } from "@/components/ui";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="container-page grid gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-28">
        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="eyebrow inline-flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sage" />
            In development · Starting with cashmere
          </p>

          <h1
            id="hero-heading"
            className="mt-8 font-serif text-[3rem] leading-[0.98] font-light tracking-[-0.03em] text-ink sm:text-[4.5rem] lg:text-[5.75rem]"
          >
            Material claims
            <br />
            deserve <em className="font-normal text-forest">evidence.</em>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite sm:text-[1.1875rem]">
            MERE is building an independent scientific verification platform that transforms
            material testing data into structured, traceable evidence. Starting with cashmere.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#contact" className="px-6 py-3">
              Get in Touch
            </ButtonLink>
            <ButtonLink href="#approach" variant="secondary" className="px-6 py-3">
              Explore Our Approach
              <Arrow direction="down" />
            </ButtonLink>
          </div>
        </div>

        <figure className="lg:col-span-5">
          <div className="relative aspect-[7/8] max-h-[34rem] w-full overflow-hidden border border-rule bg-paper sm:aspect-[4/3] lg:aspect-[7/8]">
            <FiberField />
            <span className="eyebrow absolute top-3 left-3 bg-paper/90 px-1.5 text-[0.625rem]">
              Fig. 01
            </span>
          </div>
          <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[0.6875rem] leading-relaxed text-muted">
            <span>Abstract illustration of fiber strands.</span>
            <span className="text-right">Not microscopy or test data.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
