import Link from "next/link";
import { DemoTag, StatusBadge } from "@/components/dashboard/badges";
import { PageHeader, QueryError } from "@/components/dashboard/page-header";
import { formatDate, label } from "@/lib/format";
import { isDemoMaterial, listMaterials } from "@/lib/materials";

export default async function MaterialsPage() {
  const { materials, error } = await listMaterials();

  return (
    <>
      <PageHeader eyebrow="Registry" title="Materials">
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {materials.length} registered {materials.length === 1 ? "material" : "materials"}
          </p>
          <Link
            href="/dashboard/materials/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-forest bg-forest px-5 py-2.5 text-sm font-medium tracking-tight text-ivory transition-colors hover:border-forest-deep hover:bg-forest-deep"
          >
            <span aria-hidden="true">+</span> New Material
          </Link>
        </div>
      </PageHeader>

      {error && <QueryError message={error} />}

      {!error && materials.length === 0 ? (
        <div className="mt-10 border border-dashed border-rule-strong px-6 py-14 text-center">
          <p className="font-serif text-xl text-ink">No materials to show</p>
          <p className="mt-2 text-sm text-muted">No materials are registered, or none are visible to your account.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">Registered materials</caption>
            <thead>
              <tr className="border-b border-ink">
                {["MERE ID", "Material", "Stage", "Status", "Registered"].map((h) => (
                  <th key={h} scope="col" className="eyebrow py-3 pr-6 font-normal text-[0.625rem] last:pr-0 last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="group relative border-b border-rule transition-colors hover:bg-paper">
                  <td className="py-4 pr-6 font-mono text-[0.8125rem] whitespace-nowrap text-ink">
                    <Link
                      href={`/dashboard/materials/${m.id}`}
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline"
                    >
                      {m.mere_id}
                    </Link>
                  </td>
                  <td className="py-4 pr-6">
                    <span className="flex items-center gap-2.5">
                      {isDemoMaterial(m) && <DemoTag />}
                      <span className="text-ink group-hover:text-forest">{m.name ?? "Untitled material"}</span>
                    </span>
                  </td>
                  <td className="py-4 pr-6 whitespace-nowrap text-graphite">{label(m.material_stage)}</td>
                  <td className="py-4 pr-6">
                    <StatusBadge value={m.status} />
                  </td>
                  <td className="py-4 text-right whitespace-nowrap text-graphite tabular-nums">
                    {formatDate(m.registration_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
