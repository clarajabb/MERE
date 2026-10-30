import type { MaterialStage } from "@/lib/materials";

export type MetricDataType = "NUMERIC" | "TEXT" | "BOOLEAN" | "CATEGORY";

export type MetricMethodOption = {
  id: string;
  standard_code: string;
  standard_title: string | null;
  edition_year: number | null;
  method_name: string | null;
};

export type MetricOption = {
  id: string;
  name: string;
  category: string | null;
  default_unit: string | null;
  data_type: MetricDataType;
  description: string | null;
  applicable_stages: MaterialStage[];
  methods: MetricMethodOption[];
};

export type LaboratoryOption = { id: string; name: string; country: string | null };

// Where a value came from. This is provenance, not a verification decision.
export const SOURCE_TYPES = [
  { value: "LAB_REPORT", label: "Lab report" },
  { value: "MERE_TEST", label: "MERE test" },
  { value: "THIRD_PARTY_CERTIFICATE", label: "Third-party certificate" },
  { value: "SUPPLIER_DECLARATION", label: "Supplier declaration" },
  { value: "TRACEABILITY_PLATFORM", label: "Traceability platform" },
  { value: "FORENSIC_VERIFICATION", label: "Forensic verification" },
  { value: "MANUAL_ENTRY", label: "Manual entry" },
  { value: "OTHER", label: "Other" },
] as const;

const MAX_ROWS = 50;
const NUMBER = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
const NUMBER_MAX = 40;
const VALUE_TEXT_MAX = 1000;
const UNIT_MAX = 50;
const METHOD_MAX = 200;
const NOTES_MAX = 2000;

const TEST_TEXT = {
  report_number: { label: "Test report number", max: 100 },
  lab_sample_id: { label: "Laboratory sample ID", max: 100 },
  notes: { label: "Notes", max: NOTES_MAX },
} as const;

export type TestFormValues = {
  report_number: string;
  laboratory_id: string;
  lab_sample_id: string;
  test_date: string;
  sample_received_date: string;
  notes: string;
};

export type MeasurementRow = {
  key: string;
  metric_id: string;
  value: string;
  unit: string;
  source_type: string;
  test_method: string;
  test_standard: string;
  notes: string;
};

export type TestFormErrors = Partial<Record<keyof TestFormValues, string>>;
export type RowErrors = Partial<Record<Exclude<keyof MeasurementRow, "key">, string>>;

export type MeasurementInput = {
  metric_id: string;
  value_numeric: string | null;
  value_text: string | null;
  value_boolean: boolean | null;
  unit: string | null;
  test_method: string | null;
  test_standard: string | null;
  source_type: string;
  notes: string | null;
};

export type TestInput = {
  test: {
    report_number: string | null;
    laboratory_id: string | null;
    lab_sample_id: string | null;
    test_date: string | null;
    sample_received_date: string | null;
    notes: string | null;
  };
  measurements: MeasurementInput[];
};

export function metricAppliesTo(metric: Pick<MetricOption, "applicable_stages">, stage: MaterialStage) {
  return metric.applicable_stages.length === 0 || metric.applicable_stages.includes(stage);
}

function text(formData: FormData, field: keyof TestFormValues) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

/** Reads only the known fields, so a submission cannot set a status or a parent record. */
export function parseTestForm(formData: FormData): {
  values: TestFormValues;
  rows: MeasurementRow[] | null;
} {
  const values: TestFormValues = {
    report_number: text(formData, "report_number"),
    laboratory_id: text(formData, "laboratory_id"),
    lab_sample_id: text(formData, "lab_sample_id"),
    test_date: text(formData, "test_date"),
    sample_received_date: text(formData, "sample_received_date"),
    notes: text(formData, "notes"),
  };

  const raw = formData.get("measurements");
  let parsed: unknown;
  try {
    parsed = JSON.parse(typeof raw === "string" ? raw : "");
  } catch {
    return { values, rows: null };
  }
  if (!Array.isArray(parsed)) return { values, rows: null };

  const field = (row: Record<string, unknown>, name: string) => {
    const value = row[name];
    return typeof value === "string" ? value.trim() : "";
  };
  const rows = parsed
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map((row) => ({
      key: field(row, "key"),
      metric_id: field(row, "metric_id"),
      value: field(row, "value"),
      unit: field(row, "unit"),
      source_type: field(row, "source_type"),
      test_method: field(row, "test_method"),
      test_standard: field(row, "test_standard"),
      notes: field(row, "notes"),
    }));
  return { values, rows };
}

function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Tomorrow in UTC, so that "today" is accepted in every timezone. */
function latestAllowedDate() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function validateRow(row: MeasurementRow, metric: MetricOption | undefined) {
  const errors: RowErrors = {};
  let value_numeric: string | null = null;
  let value_text: string | null = null;
  let value_boolean: boolean | null = null;
  let unit: string | null = null;

  if (!metric) {
    errors.metric_id = row.metric_id
      ? "This metric is not available for this material."
      : "Select a metric.";
  } else {
    unit = metric.default_unit;
    if (!row.value) {
      errors.value = "Enter a value.";
    } else if (metric.data_type === "NUMERIC") {
      if (!NUMBER.test(row.value) || row.value.length > NUMBER_MAX) {
        errors.value = "Enter a number, such as 15.4.";
      } else {
        value_numeric = row.value;
      }
    } else if (metric.data_type === "BOOLEAN") {
      if (row.value !== "true" && row.value !== "false") errors.value = "Select Yes or No.";
      else value_boolean = row.value === "true";
    } else if (row.value.length > VALUE_TEXT_MAX) {
      errors.value = `Value must be ${VALUE_TEXT_MAX} characters or fewer.`;
    } else {
      value_text = row.value;
    }

    // The metric's own unit always wins. Only a numeric metric without one takes a typed unit.
    if (!unit && metric.data_type === "NUMERIC") {
      if (!row.unit) errors.unit = "Enter a unit.";
      else if (row.unit.length > UNIT_MAX) errors.unit = `Unit must be ${UNIT_MAX} characters or fewer.`;
      else unit = row.unit;
    }
  }

  if (!SOURCE_TYPES.some((source) => source.value === row.source_type)) {
    errors.source_type = "Select a source type.";
  }
  if (row.test_method.length > METHOD_MAX) errors.test_method = `Test method must be ${METHOD_MAX} characters or fewer.`;
  if (row.test_standard.length > METHOD_MAX) {
    errors.test_standard = `Test standard must be ${METHOD_MAX} characters or fewer.`;
  }
  if (row.notes.length > NOTES_MAX) errors.notes = `Notes must be ${NOTES_MAX} characters or fewer.`;

  return {
    errors,
    input: {
      metric_id: row.metric_id,
      value_numeric,
      value_text,
      value_boolean,
      unit,
      test_method: row.test_method || null,
      test_standard: row.test_standard || null,
      source_type: row.source_type,
      notes: row.notes || null,
    },
  };
}

/**
 * Server-side validation against records loaded for the signed-in user. A metric
 * or laboratory that is inactive, inapplicable or unknown is rejected here.
 */
export function validateTestForm(
  values: TestFormValues,
  rows: MeasurementRow[] | null,
  options: { metrics: MetricOption[]; laboratories: LaboratoryOption[] },
): {
  formError: string | null;
  errors: TestFormErrors;
  rowErrors: Record<string, RowErrors>;
  input: TestInput | null;
} {
  const errors: TestFormErrors = {};
  const rowErrors: Record<string, RowErrors> = {};

  for (const [field, { label, max }] of Object.entries(TEST_TEXT) as [keyof typeof TEST_TEXT, { label: string; max: number }][]) {
    if (values[field].length > max) errors[field] = `${label} must be ${max} characters or fewer.`;
  }

  if (values.laboratory_id && !options.laboratories.some((lab) => lab.id === values.laboratory_id)) {
    errors.laboratory_id = "This laboratory is not available.";
  }

  const latest = latestAllowedDate();
  if (values.test_date && !isDate(values.test_date)) errors.test_date = "Enter a valid date.";
  else if (values.test_date > latest) errors.test_date = "Test date cannot be in the future.";
  if (values.sample_received_date && !isDate(values.sample_received_date)) {
    errors.sample_received_date = "Enter a valid date.";
  } else if (values.sample_received_date > latest) {
    errors.sample_received_date = "Sample received date cannot be in the future.";
  } else if (values.test_date && values.sample_received_date && values.sample_received_date > values.test_date) {
    errors.sample_received_date = "The sample must be received on or before the test date.";
  }

  if (!rows) {
    return { formError: "The measurements could not be read. Please try again.", errors, rowErrors, input: null };
  }
  if (rows.length === 0) {
    return { formError: "Add at least one measurement.", errors, rowErrors, input: null };
  }
  if (rows.length > MAX_ROWS) {
    return { formError: `A test can have at most ${MAX_ROWS} measurements.`, errors, rowErrors, input: null };
  }

  const metrics = new Map(options.metrics.map((metric) => [metric.id, metric]));
  const measurements: MeasurementInput[] = [];
  for (const row of rows) {
    const result = validateRow(row, metrics.get(row.metric_id));
    if (Object.keys(result.errors).length > 0) rowErrors[row.key] = result.errors;
    measurements.push(result.input);
  }

  if (Object.keys(errors).length > 0 || Object.keys(rowErrors).length > 0) {
    return { formError: "Please correct the highlighted fields.", errors, rowErrors, input: null };
  }

  return {
    formError: null,
    errors,
    rowErrors,
    input: {
      test: {
        report_number: values.report_number || null,
        laboratory_id: values.laboratory_id || null,
        lab_sample_id: values.lab_sample_id || null,
        test_date: values.test_date || null,
        sample_received_date: values.sample_received_date || null,
        notes: values.notes || null,
      },
      measurements,
    },
  };
}
