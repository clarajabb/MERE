import { mailto, site } from "@/lib/site";
import { Monogram } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="container-page flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2.5 text-ink">
            <Monogram className="h-5 w-5 text-forest" />
            <span className="font-serif text-[1.3rem] leading-none tracking-[0.2em]">MERE</span>
          </p>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Independent scientific materials verification — in development.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-xs text-muted md:items-end">
          <p>
            Contact:{" "}
            <a href={mailto} className="text-graphite underline-offset-4 hover:text-forest hover:underline">
              {site.email}
            </a>
          </p>
          <p>© 2026 MERE</p>
        </div>
      </div>
    </footer>
  );
}
