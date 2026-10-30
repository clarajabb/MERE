"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import type { TestFormState } from "@/app/dashboard/materials/[id]/tests/new/actions";
import { Field, fixedValueClass, inputClass, Section } from "@/components/dashboard/form";
import {
  SOURCE_TYPES,
  type LaboratoryOption,
  type MeasurementRow,
  type MetricOption,
  type RowErrors,
} from "@/lib/test-form";

// method_id only drives the prefill below. The server ignores it.
type Row = MeasurementRow & { method_id: string };

const blankRow = (key: string): Row => ({
  key,
  metric_id: "",
  value: "",
  unit: "",
  source_type: "",
  method_id: "",
  test_method: "",
  test_standard: "",
  notes: "",
});

const initial: TestFormState = {
  attempt: 0,
  error: null,
  fieldErrors: {},
  rowErrors: {},
  values: {
    report_number: "",
    laboratory_id: "",
    lab_sample_id: "",
    test_date: "",
    sample_received_date: "",
    notes: "",
  },
};

export function TestForm({
  action: submit,
  materialHref,
  metrics,
  laboratories,
}: {
  action: (prev: TestFormState, formData: FormData) => Promise<TestFormState>;
  materialHref: string;
  metrics: MetricOption[];
  laboratories: LaboratoryOption[];
}) {
  const [state, action, pending] = useActionState(submit, initial);
  const { values, fieldErrors, rowErrors } = state;
  const [rows, setRows] = useState<Row[]>([blankRow("r1")]);
  const [newRowKey, setNewRowKey] = useState<string | null>(null);
  const nextKey = useRef(2);
  const formRef = useRef<HTMLFormElement>(null);

  // Take the user to the first problem after each rejected submission.
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state.attempt]);

  const updateRow = (key: string, patch: Partial<Row>) =>
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const addRow = () => {
    const key = `r${nextKey.current++}`;
    setRows((current) => [...current, blankRow(key)]);
    setNewRowKey(key);
  };

  const removeRow = (key: string) => setRows((current) => current.filter((row) => row.key !== key));

  // React resets a form after its action runs. The key remounts the form with
  // the submitted values as defaults. Measurement rows live in state above it.
  return (
    <form key={state.attempt} ref={formRef} action={action} className="mt-10 max-w-4xl space-y-12" noValidate>
      {state.error && (
        <p
          role="alert"
          className="border-l-2 border-[#9a3b2e] bg-[#f6ebe6] px-4 py-3 text-sm leading-snug text-[#7a2f24]"
        >
          {state.error}
        </p>
      )}

      <input type="hidden" name="measurements" value={JSON.stringify(rows)} />

      <Section title="Test" note="Optional">
        <Field label="Test report number" htmlFor="report_number" error={fieldErrors.report_number}>
          <input
            id="report_number"
            name="report_number"
            type="text"
            defaultValue={values.report_number}
            aria-invalid={Boolean(fieldErrors.report_number)}
            aria-describedby={fieldErrors.report_number ? "report_number-error" : undefined}
            className={`${inputClass} font-mono text-sm`}
          />
        </Field>

        <Field label="Laboratory sample ID" htmlFor="lab_sample_id" error={fieldErrors.lab_sample_id}>
          <input
            id="lab_sample_id"
            name="lab_sample_id"
            type="text"
            defaultValue={values.lab_sample_id}
            aria-invalid={Boolean(fieldErrors.lab_sample_id)}
            aria-describedby={fieldErrors.lab_sample_id ? "lab_sample_id-error" : undefined}
            className={`${inputClass} font-mono text-sm`}
          />
        </Field>

        <Field
          label="Laboratory"
          htmlFor="laboratory_id"
          error={fieldErrors.laboratory_id}
          hint={laboratories.length === 0 ? "No laboratory records exist yet." : undefined}
          className="sm:col-span-2"
        >
          <select
            id="laboratory_id"
            name="laboratory_id"
            defaultValue={values.laboratory_id}
            aria-invalid={Boolean(fieldErrors.laboratory_id)}
            aria-describedby={fieldErrors.laboratory_id ? "laboratory_id-error" : undefined}
            className={inputClass}
          >
            <option value="">Not specified</option>
            {laboratories.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.country ? `${lab.name} · ${lab.country}` : lab.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sample received date" htmlFor="sample_received_date" error={fieldErrors.sample_received_date}>
          <input
            id="sample_received_date"
            name="sample_received_date"
            type="date"
            defaultValue={values.sample_received_date}
            aria-invalid={Boolean(fieldErrors.sample_received_date)}
            aria-describedby={fieldErrors.sample_received_date ? "sample_received_date-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Test date" htmlFor="test_date" error={fieldErrors.test_date}>
          <input
            id="test_date"
            name="test_date"
            type="date"
            defaultValue={values.test_date}
            aria-invalid={Boolean(fieldErrors.test_date)}
            aria-describedby={fieldErrors.test_date ? "test_date-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Notes" htmlFor="notes" error={fieldErrors.notes} className="sm:col-span-2">
          <textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={values.notes}
            aria-invalid={Boolean(fieldErrors.notes)}
            aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
            className={inputClass}
          />
        </Field>
      </Section>

      <section aria-labelledby="measurements-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule pb-3">
          <h2 id="measurements-heading" className="eyebrow text-ink">
            Measurements <span className="text-muted">({rows.length})</span>
          </h2>
          <span className="font-mono text-[0.6875rem] text-muted">At least one · Saved as Pending review</span>
        </div>

        {metrics.length === 0 ? (
          <p className="mt-6 border border-dashed border-rule-strong px-6 py-10 text-center text-sm text-muted">
            No active metrics apply to this material&apos;s stage.
          </p>
        ) : (
          <>
            <ol className="mt-6 space-y-5">
              {rows.map((row, index) => (
                <MeasurementFields
                  key={row.key}
                  row={row}
                  index={index}
                  metrics={metrics}
                  errors={rowErrors[row.key] ?? {}}
                  autoFocus={row.key === newRowKey}
                  onChange={(patch) => updateRow(row.key, patch)}
                  onRemove={rows.length > 1 ? () => removeRow(row.key) : undefined}
                />
              ))}
            </ol>
            <button
              type="button"
              onClick={addRow}
              className="mt-5 rounded-full border border-rule-strong px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
            >
              <span aria-hidden="true">+</span> Add measurement
            </button>
          </>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-rule pt-8">
        <button
          type="submit"
          disabled={pending || metrics.length === 0}
          className="inline-flex items-center justify-center rounded-full border border-forest bg-forest px-6 py-2.5 text-sm font-medium tracking-tight text-ivory transition-colors hover:border-forest-deep hover:bg-forest-deep disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving…" : "Save test"}
        </button>
        <Link href={materialHref} className="text-sm text-muted transition-colors hover:text-forest">
          Cancel
        </Link>
        <p className="font-mono text-[0.6875rem] text-muted sm:ml-auto">Unverified until a reviewer decides</p>
      </div>
    </form>
  );
}

function MeasurementFields({
  row,
  index,
  metrics,
  errors,
  autoFocus,
  onChange,
  onRemove,
}: {
  row: Row;
  index: number;
  metrics: MetricOption[];
  errors: RowErrors;
  autoFocus: boolean;
  onChange: (patch: Partial<Row>) => void;
  onRemove?: () => void;
}) {
  const metric = metrics.find((m) => m.id === row.metric_id);
  const id = (field: string) => `${row.key}-${field}`;
  const describedBy = (field: keyof RowErrors) => (errors[field] ? `${id(field)}-error` : undefined);
  const groups = groupByCategory(metrics);

  return (
    <li className="border border-rule bg-paper p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-[0.625rem]">Measurement {index + 1}</p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove measurement ${index + 1}`}
            className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-[#7a2f24]"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-6">
        <Field
          label="Metric"
          htmlFor={id("metric_id")}
          required
          error={errors.metric_id}
          hint={metric?.description ?? undefined}
          className="sm:col-span-6"
        >
          <select
            id={id("metric_id")}
            required
            autoFocus={autoFocus}
            value={row.metric_id}
            aria-invalid={Boolean(errors.metric_id)}
            aria-describedby={describedBy("metric_id")}
            onChange={(e) =>
              onChange({ metric_id: e.target.value, value: "", unit: "", method_id: "", test_method: "", test_standard: "" })
            }
            className={inputClass}
          >
            <option value="" disabled>
              Select a metric
            </option>
            {groups.map(([category, options]) =>
              category ? (
                <optgroup key={category} label={category}>
                  {options.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              ) : (
                options.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))
              ),
            )}
          </select>
        </Field>

        <Field label="Value" htmlFor={id("value")} required error={errors.value} className="sm:col-span-2">
          {metric?.data_type === "BOOLEAN" ? (
            <select
              id={id("value")}
              required
              value={row.value}
              aria-invalid={Boolean(errors.value)}
              aria-describedby={describedBy("value")}
              onChange={(e) => onChange({ value: e.target.value })}
              className={inputClass}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <input
              id={id("value")}
              type="text"
              required
              disabled={!metric}
              inputMode={metric?.data_type === "NUMERIC" ? "decimal" : "text"}
              value={row.value}
              placeholder={metric ? undefined : "Select a metric first"}
              aria-invalid={Boolean(errors.value)}
              aria-describedby={describedBy("value")}
              onChange={(e) => onChange({ value: e.target.value })}
              className={`${inputClass} disabled:cursor-not-allowed ${metric?.data_type === "NUMERIC" ? "font-mono text-sm tabular-nums" : ""}`}
            />
          )}
        </Field>

        <Field
          label="Unit"
          htmlFor={id("unit")}
          required={metric?.data_type === "NUMERIC" && !metric.default_unit}
          error={errors.unit}
          className="sm:col-span-1"
        >
          {metric?.data_type === "NUMERIC" && !metric.default_unit ? (
            <input
              id={id("unit")}
              type="text"
              required
              value={row.unit}
              aria-invalid={Boolean(errors.unit)}
              aria-describedby={describedBy("unit")}
              onChange={(e) => onChange({ unit: e.target.value })}
              className={`${inputClass} font-mono text-sm`}
            />
          ) : (
            <input
              id={id("unit")}
              type="text"
              readOnly
              tabIndex={-1}
              value={metric?.default_unit ?? "—"}
              className={`${fixedValueClass} font-mono text-sm`}
            />
          )}
        </Field>

        <Field label="Source type" htmlFor={id("source_type")} required error={errors.source_type} className="sm:col-span-3">
          <select
            id={id("source_type")}
            required
            value={row.source_type}
            aria-invalid={Boolean(errors.source_type)}
            aria-describedby={describedBy("source_type")}
            onChange={(e) => onChange({ source_type: e.target.value })}
            className={inputClass}
          >
            <option value="" disabled>
              Select a source
            </option>
            {SOURCE_TYPES.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </Field>

        {metric && metric.methods.length > 0 && (
          <Field
            label="Registered method"
            htmlFor={id("method_id")}
            hint="Fills in the test method and standard below. You can still edit them."
            className="sm:col-span-6"
          >
            <select
              id={id("method_id")}
              value={row.method_id}
              onChange={(e) => {
                const method = metric.methods.find((m) => m.id === e.target.value);
                onChange({
                  method_id: e.target.value,
                  test_method: method?.method_name ?? method?.standard_title ?? "",
                  test_standard: method?.standard_code ?? "",
                });
              }}
              className={inputClass}
            >
              <option value="">None</option>
              {metric.methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {[m.edition_year ? `${m.standard_code} (${m.edition_year})` : m.standard_code, m.method_name ?? m.standard_title]
                    .filter(Boolean)
                    .join(" — ")}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Test method" htmlFor={id("test_method")} error={errors.test_method} className="sm:col-span-3">
          <input
            id={id("test_method")}
            type="text"
            value={row.test_method}
            aria-invalid={Boolean(errors.test_method)}
            aria-describedby={describedBy("test_method")}
            onChange={(e) => onChange({ test_method: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Test standard" htmlFor={id("test_standard")} error={errors.test_standard} className="sm:col-span-3">
          <input
            id={id("test_standard")}
            type="text"
            value={row.test_standard}
            aria-invalid={Boolean(errors.test_standard)}
            aria-describedby={describedBy("test_standard")}
            onChange={(e) => onChange({ test_standard: e.target.value })}
            className={`${inputClass} font-mono text-sm`}
          />
        </Field>

        <Field label="Notes" htmlFor={id("notes")} error={errors.notes} className="sm:col-span-6">
          <input
            id={id("notes")}
            type="text"
            value={row.notes}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={describedBy("notes")}
            onChange={(e) => onChange({ notes: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>
    </li>
  );
}

function groupByCategory(metrics: MetricOption[]) {
  const groups = new Map<string, MetricOption[]>();
  for (const metric of metrics) {
    const category = metric.category ?? "";
    groups.set(category, [...(groups.get(category) ?? []), metric]);
  }
  return [...groups.entries()];
}
