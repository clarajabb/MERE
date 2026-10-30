import type { MaterialStage } from "@/lib/materials";

export const MATERIAL_STAGES: { value: MaterialStage; label: string }[] = [
  { value: "RAW_FIBER", label: "Raw Fiber" },
  { value: "YARN", label: "Yarn" },
  { value: "FABRIC", label: "Fabric" },
  { value: "GARMENT", label: "Garment" },
];

const OPTIONAL_FIELDS = {
  internal_reference: { label: "Internal reference", max: 100 },
  lot_number: { label: "Lot number", max: 100 },
  batch_number: { label: "Batch number", max: 100 },
  claimed_composition: { label: "Claimed composition", max: 500 },
  claimed_origin: { label: "Claimed origin", max: 200 },
} as const;

const NAME_MAX = 200;

type OptionalField = keyof typeof OPTIONAL_FIELDS;
type FieldName = "name" | "material_stage" | OptionalField;

export type MaterialFormValues = Record<FieldName, string>;
export type MaterialFormErrors = Partial<Record<FieldName, string>>;

/** The columns a registration may set. The database generates the rest. */
export type MaterialInput = { name: string; material_stage: MaterialStage } & Record<OptionalField, string | null>;

export const OPTIONAL_COLUMNS = Object.keys(OPTIONAL_FIELDS) as OptionalField[];

function text(formData: FormData, field: FieldName) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Server-side validation for material registration. Only the fields named here
 * are read, so a submission cannot set its own status, type or MERE ID.
 */
export function parseMaterialForm(formData: FormData): {
  values: MaterialFormValues;
  errors: MaterialFormErrors;
  input: MaterialInput | null;
} {
  const values = {
    name: text(formData, "name"),
    material_stage: text(formData, "material_stage"),
  } as MaterialFormValues;
  for (const field of OPTIONAL_COLUMNS) values[field] = text(formData, field);

  const errors: MaterialFormErrors = {};

  if (!values.name) errors.name = "Enter a material name.";
  else if (values.name.length > NAME_MAX) errors.name = `Material name must be ${NAME_MAX} characters or fewer.`;

  const stage = MATERIAL_STAGES.find((s) => s.value === values.material_stage)?.value;
  if (!stage) {
    errors.material_stage = "Select a material stage.";
    values.material_stage = "";
  }

  for (const field of OPTIONAL_COLUMNS) {
    const { label, max } = OPTIONAL_FIELDS[field];
    if (values[field].length > max) errors[field] = `${label} must be ${max} characters or fewer.`;
  }

  if (!stage || Object.keys(errors).length > 0) return { values, errors, input: null };

  return {
    values,
    errors,
    input: {
      name: values.name,
      material_stage: stage,
      internal_reference: values.internal_reference || null,
      lot_number: values.lot_number || null,
      batch_number: values.batch_number || null,
      claimed_composition: values.claimed_composition || null,
      claimed_origin: values.claimed_origin || null,
    },
  };
}
