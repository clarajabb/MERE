import Link from "next/link";
import { notFound } from "next/navigation";
import { registerTest } from "@/app/dashboard/materials/[id]/tests/new/actions";
import { TestForm } from "@/app/dashboard/materials/[id]/tests/new/test-form";
import { DemoTag } from "@/components/dashboard/badges";
import { PageHeader, QueryError } from "@/components/dashboard/page-header";
import { isDemoMaterial } from "@/lib/materials";
import { getMaterialForTest, getTestFormOptions } from "@/lib/tests";

export default async function NewTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { material, error } = await getMaterialForTest(id);

  if (!material) {
    if (error) return <QueryError message={error} />;
    notFound();
  }

  const options = await getTestFormOptions(material.material_stage);
  const materialHref = `/dashboard/materials/${material.id}`;
  const demo = isDemoMaterial(material);

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link href={materialHref} className="inline-flex items-center gap-2 text-muted transition-colors hover:text-forest">
          <span aria-hidden="true">←</span> {material.mere_id}
        </Link>
      </nav>

      <PageHeader
        eyebrow={
          <span className="flex items-center gap-3">
            <span className="text-ink">{material.mere_id}</span>
            {demo && <DemoTag />}
          </span>
        }
        title="Add test"
      >
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          For <span className="text-ink">{material.name ?? "Untitled material"}</span>. The test and its measurements
          stay unverified until an authorized reviewer makes a separate decision.
        </p>
      </PageHeader>

      {demo && (
        <div
          role="note"
          className="mt-8 flex max-w-4xl items-start gap-3 border border-rule-strong bg-[repeating-linear-gradient(135deg,var(--color-ivory)_0_10px,var(--color-paper)_10px_20px)] px-5 py-4"
        >
          <DemoTag />
          <p className="text-sm leading-snug text-ink">
            <span className="font-medium">This material is fictional.</span> Anything recorded here is demonstration
            data, and it will not be presented as laboratory-tested or independently verified.
          </p>
        </div>
      )}

      {options.error ? (
        <QueryError message={options.error} />
      ) : (
        <TestForm
          action={registerTest.bind(null, material.id)}
          materialHref={materialHref}
          metrics={options.metrics}
          laboratories={options.laboratories}
        />
      )}
    </>
  );
}
