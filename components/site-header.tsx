"use client";

import { useEffect, useState } from "react";
import { ButtonLink, Monogram } from "@/components/ui";

const links = [
  { href: "#problem", label: "The Problem" },
  { href: "#approach", label: "Our Approach" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule/80 bg-ivory/85 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/75">
      <div className="container-page flex h-16 items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-ink"
          aria-label="MERE — back to top"
          onClick={() => setOpen(false)}
        >
          <Monogram className="h-5 w-5 text-forest" />
          <span className="font-serif text-[1.3rem] leading-none tracking-[0.2em]">MERE</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-graphite transition-colors hover:text-forest"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="#contact" variant="secondary" className="px-4 py-2 text-[0.8125rem]">
            Get in Touch
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 7h14M3 13h14" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-rule bg-ivory md:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-rule/70 py-4 font-serif text-2xl text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-5 pb-3">
            <ButtonLink href="#contact" onClick={() => setOpen(false)} className="w-full py-3">
              Get in Touch
            </ButtonLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
