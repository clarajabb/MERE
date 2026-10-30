"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerMaterial, type RegisterState } from "@/app/dashboard/materials/new/actions";
import { Field, fixedValueClass, inputClass, Section } from "@/components/dashboard/form";
import { MATERIAL_STAGES, type MaterialFormErrors } from "@/lib/material-form";

const initial: RegisterState = {
  attempt: 0,
  error: null,
  fieldErrors: {},
  values: {
    name: "",
    material_stage: "",
    internal_reference: "",
    lot_number: "",
    batch_number: "",
    claimed_composition: "",
    claimed_origin: "",
  },
};

const FIELD_ORDER: (keyof MaterialFormErrors)[] = [
  "name",
  "material_stage",
  "internal_reference",
  "lot_number",
  "batch_number",
  "claimed_composition",
  "claimed_origin",
];

export function RegistrationForm() {
  const [state, action, pending] = useActionState(registerMaterial, initial);
  const { values, fieldErrors } = state;
  const firstInvalid = FIELD_ORDER.find((field) => fieldErrors[field]);

  // React resets a form after its action runs. The key remounts the form with
  // the submitted values as defaults, so a failed save loses nothing.
  return (
    <form key={state.attempt} action={action} className="mt-10 max-w-3xl space-y-12" noValidate>
      {state.error && (
        <p
          role="alert"
          className="border-l-2 border-[#9a3b2e] bg-[#f6ebe6] px-4 py-3 text-sm leading-snug text-[#7a2f24]"
        >
          {state.error}
        </p>
      )}

      <Section title="Material">
        <Field label="Material name" htmlFor="name" required error={fieldErrors.name} className="sm:col-span-2">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoFocus={firstInvalid === "name"}
            defaultValue={values.name}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Material type" htmlFor="material_type" hint="Currently the only supported type.">
          <input
            id="material_type"
            type="text"
            value="Cashmere"
            readOnly
            className={fixedValueClass}
          />
        </Field>

        <Field label="Material stage" htmlFor="material_stage" required error={fieldErrors.material_stage}>
          <select
            id="material_stage"
            name="material_stage"
            required
            autoFocus={firstInvalid === "material_stage"}
            defaultValue={values.material_stage}
            aria-invalid={Boolean(fieldErrors.material_stage)}
            aria-describedby={fieldErrors.material_stage ? "material_stage-error" : undefined}
            className={inputClass}
          >
            <option value="" disabled>
              Select a stage
            </option>
            {MATERIAL_STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Identification" note="Optional">
        <TextField
          name="internal_reference"
          label="Internal reference"
          state={state}
          autoFocus={firstInvalid === "internal_reference"}
          className="sm:col-span-2"
        />
        <TextField name="lot_number" label="Lot number" state={state} autoFocus={firstInvalid === "lot_number"} mono />
        <TextField
          name="batch_number"
          label="Batch number"
          state={state}
          autoFocus={firstInvalid === "batch_number"}
          mono
        />
      </Section>

      <Section title="Claims" note="Optional · Recorded as declared, not verified">
        <TextField
          name="claimed_composition"
          label="Claimed composition"
          state={state}
          autoFocus={firstInvalid === "claimed_composition"}
        />
        <TextField
          name="claimed_origin"
          label="Claimed origin"
          state={state}
          autoFocus={firstInvalid === "claimed_origin"}
        />
      </Section>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-rule pt-8">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full border border-forest bg-forest px-6 py-2.5 text-sm font-medium tracking-tight text-ivory transition-colors hover:border-forest-deep hover:bg-forest-deep disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Registering…" : "Register material"}
        </button>
        <Link href="/dashboard" className="text-sm text-muted transition-colors hover:text-forest">
          Cancel
        </Link>
        <p className="font-mono text-[0.6875rem] text-muted sm:ml-auto">
          Saved as Draft · MERE ID assigned automatically
        </p>
      </div>
    </form>
  );
}

function TextField({
  name,
  label,
  state,
  autoFocus,
  mono,
  className,
}: {
  name: Exclude<keyof RegisterState["values"], "name" | "material_stage">;
  label: string;
  state: RegisterState;
  autoFocus: boolean;
  mono?: boolean;
  className?: string;
}) {
  const error = state.fieldErrors[name];
  return (
    <Field label={label} htmlFor={name} error={error} className={className}>
      <input
        id={name}
        name={name}
        type="text"
        autoFocus={autoFocus}
        defaultValue={state.values[name]}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${inputClass} ${mono ? "font-mono text-sm" : ""}`}
      />
    </Field>
  );
}
