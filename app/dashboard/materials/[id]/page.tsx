import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoTag, StatusBadge } from "@/components/dashboard/badges";
import { PageHeader, QueryError } from "@/components/dashboard/page-header";
import { formatDate, label } from "@/lib/format";
import { getMaterial, isDemoMaterial, type MaterialTest, type Measurement, type VerificationStatus } from "@/lib/materials";

// A demonstration record never shows a status implying real review or testing.
function displayedStatus(status: VerificationStatus, demo: boolean) {
  const claimsReview = status === "DOCUMENT_REVIEWED" || status === "INDEPENDENTLY_TESTED" || status === "MERE_VERIFIED";
  return demo && claimsReview ? "DEMONSTRATION" : status;
}

export default async function MaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ registered?: string; test?: string }>;
}) {
  const { id } = await params;
  const { registered, test } = await searchParams;
  const { material, measurements, tests, error } = await getMaterial(id);

  if (!material) {
    if (error) return <QueryError message={error} />;
    notFound();
  }

  const demo = isDemoMaterial(material);

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-forest">
          <span aria-hidden="true">←</span> Materials
        </Link>
      </nav>

      {(registered === "new" || registered === "existing") && (
        <p role="status" className="mb-8 border-l-2 border-forest bg-sage-soft px-4 py-3 text-sm leading-snug text-forest-deep">
          {registered === "new" ? (
            <>
              <span className="font-medium">Material registered.</span> Its MERE ID is{" "}
              <span className="font-mono">{material.mere_id}</span>.
            </>
          ) : (
            <>
              <span className="font-medium">Already registered.</span> An identical material was saved moments ago as{" "}
              <span className="font-mono">{material.mere_id}</span>, so no duplicate was created.
            </>
          )}
        </p>
      )}

      {(test === "new" || test === "existing") && (
        <p role="status" className="mb-8 border-l-2 border-forest bg-sage-soft px-4 py-3 text-sm leading-snug text-forest-deep">
          {test === "new" ? (
            <>
              <span className="font-medium">Test saved.</span> It and its measurements are pending review, and remain
              unverified until a reviewer decides.
            </>
          ) : (
            <>
              <span className="font-medium">Already saved.</span> An identical test was saved moments ago, so no
              duplicate was created.
            </>
          )}
        </p>
      )}

      <PageHeader
        eyebrow={
          <span className="flex items-center gap-3">
            <span className="text-ink">{material.mere_id}</span>
            {demo && <DemoTag />}
          </span>
        }
        title={material.name ?? "Untitled material"}
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <StatusBadge value={material.status} />
          <Link
            href={`/dashboard/materials/${material.id}/tests/new`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-forest bg-forest px-5 py-2.5 text-sm font-medium tracking-tight text-ivory transition-colors hover:border-forest-deep hover:bg-forest-deep"
          >
            <span aria-hidden="true">+</span> Add Test
          </Link>
        </div>
      </PageHeader>

      {demo && (
        <div
          role="note"
          className="mt-8 flex items-start gap-3 border border-rule-strong bg-[repeating-linear-gradient(135deg,var(--color-ivory)_0_10px,var(--color-paper)_10px_20px)] px-5 py-4"
        >
          <DemoTag />
          <p className="text-sm leading-snug text-ink">
            <span className="font-medium">Demonstration data.</span> This material and its measurements are
            fictional. No laboratory testing or independent verification was performed.
          </p>
        </div>
      )}

      {error && <QueryError message={error} />}

      <section aria-labelledby="facts-heading" className="mt-10">
        <h2 id="facts-heading" className="eyebrow text-ink">Material record</h2>
        <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          <Fact label="MERE ID" value={material.mere_id} mono />
          <Fact label="Material name" value={material.name} />
          <Fact label="Material stage" value={label(material.material_stage)} />
          <Fact label="Material type" value={label(material.material_type)} />
          <Fact label="Claimed composition" value={material.claimed_composition} note="As declared" />
          <Fact label="Claimed origin" value={material.claimed_origin} note="As declared" />
          <Fact label="Current status" value={<StatusBadge value={material.status} />} />
          <Fact label="Registered" value={formatDate(material.registration_date)} />
          <Fact
            label="Lot / Batch"
            value={[material.lot_number, material.batch_number].filter(Boolean).join(" / ") || null}
            mono
          />
          <Fact label="Internal reference" value={material.internal_reference} mono className="lg:col-span-3" />
        </dl>
      </section>

      <section aria-labelledby="tests-heading" className="mt-14">
        <h2 id="tests-heading" className="eyebrow text-ink">
          Tests <span className="text-muted">({tests.length})</span>
        </h2>
        <TestsTable tests={tests} demo={demo} />
      </section>

      <section aria-labelledby="measurements-heading" className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="measurements-heading" className="eyebrow text-ink">
            Measurements <span className="text-muted">({measurements.length})</span>
          </h2>
          {demo && <p className="font-mono text-[0.6875rem] text-muted">Fictional values · not laboratory-verified</p>}
        </div>
        <MeasurementsTable measurements={measurements} demo={demo} />
      </section>
    </>
  );
}

function Fact({
  label,
  value,
  note,
  mono,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  mono?: boolean;
  className?: string;
}) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className={`bg-paper px-5 py-4 ${className}`}>
      <dt className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-[0.625rem]">{label}</span>
        {note && <span className="font-mono text-[0.625rem] text-faint">{note}</span>}
      </dt>
      <dd className={`mt-2 text-[0.9375rem] text-ink ${mono ? "font-mono text-sm" : ""}`}>
        {empty ? <span className="text-faint">Not recorded</span> : value}
      </dd>
    </div>
  );
}

function displayValue(m: Measurement) {
  if (m.value_numeric !== null && m.value_numeric !== undefined) return String(m.value_numeric);
  if (m.value_text) return m.value_text;
  if (m.value_boolean !== null && m.value_boolean !== undefined) return m.value_boolean ? "Yes" : "No";
  return "—";
}

function TestsTable({ tests, demo }: { tests: MaterialTest[]; demo: boolean }) {
  if (tests.length === 0) {
    return (
      <p className="mt-4 border border-dashed border-rule-strong px-6 py-10 text-center text-sm text-muted">
        No tests recorded for this material.
      </p>
    );
  }
  return (
    <div className="mt-4 overflow-x-auto border border-rule bg-paper">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <caption className="sr-only">Tests</caption>
        <thead>
          <tr className="border-b border-rule">
            {["Test report", "Laboratory", "Sample ID", "Received", "Tested", "Verification status"].map((h) => (
              <th key={h} scope="col" className="eyebrow px-5 py-3 font-normal text-[0.625rem]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-b border-rule last:border-b-0">
              <th scope="row" className="px-5 py-4 align-top font-mono text-[0.8125rem] font-normal text-ink">
                {t.report_number ?? <span className="text-faint">—</span>}
                {t.notes && <p className="mt-1 max-w-xs font-sans text-xs leading-snug text-muted">{t.notes}</p>}
              </th>
              <td className="px-5 py-4 align-top text-graphite">{t.laboratory?.name ?? <span className="text-faint">—</span>}</td>
              <td className="px-5 py-4 align-top font-mono text-[0.8125rem] text-graphite">
                {t.lab_sample_id ?? <span className="text-faint">—</span>}
              </td>
              <td className="px-5 py-4 align-top whitespace-nowrap text-graphite tabular-nums">{formatDate(t.sample_received_date)}</td>
              <td className="px-5 py-4 align-top whitespace-nowrap text-graphite tabular-nums">{formatDate(t.test_date)}</td>
              <td className="px-5 py-4 align-top">
                <StatusBadge value={displayedStatus(t.verification_status, demo)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MeasurementsTable({ measurements, demo }: { measurements: Measurement[]; demo: boolean }) {
  if (measurements.length === 0) {
    return (
      <p className="mt-4 border border-dashed border-rule-strong px-6 py-10 text-center text-sm text-muted">
        No measurements recorded for this material.
      </p>
    );
  }
  return (
    <div className="mt-4 overflow-x-auto border border-rule bg-paper">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <caption className="sr-only">Scientific measurements</caption>
        <thead>
          <tr className="border-b border-rule">
            {["Metric", "Value", "Unit", "Verification status", "Source", "Test report"].map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`eyebrow px-5 py-3 font-normal text-[0.625rem] ${i === 1 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m.id} className="border-b border-rule last:border-b-0">
              <th scope="row" className="px-5 py-4 font-normal text-ink">
                {m.metric?.name ?? "Unknown metric"}
                {(m.test_standard || m.test_method) && (
                  <p className="mt-1 font-mono text-[0.6875rem] text-muted">
                    {[m.test_standard, m.test_method].filter(Boolean).join(" · ")}
                  </p>
                )}
                {m.notes && <p className="mt-1 max-w-xs text-xs leading-snug text-muted">{m.notes}</p>}
              </th>
              <td className="px-5 py-4 text-right font-serif text-xl leading-none text-ink tabular-nums">
                {displayValue(m)}
              </td>
              <td className="px-5 py-4 font-mono text-[0.8125rem] text-graphite">
                {m.unit ?? m.metric?.default_unit ?? "—"}
              </td>
              <td className="px-5 py-4">
                <StatusBadge value={displayedStatus(m.verification_status, demo)} />
              </td>
              <td className="px-5 py-4 text-xs text-muted">{label(m.source_type)}</td>
              <td className="px-5 py-4 font-mono text-[0.8125rem] text-graphite">
                {m.test?.report_number ?? <span className="text-faint">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
