import "server-only";

import { requireStaff } from "@/lib/auth";
import { OPTIONAL_COLUMNS, type MaterialInput } from "@/lib/material-form";
import { createClient } from "@/lib/supabase/server";

export type MaterialStage = "RAW_FIBER" | "YARN" | "FABRIC" | "GARMENT";
export type MaterialStatus =
  | "DRAFT"
  | "PENDING_TESTING"
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "ARCHIVED";
export type VerificationStatus =
  | "SUPPLIER_DECLARED"
  | "PENDING_REVIEW"
  | "DOCUMENT_REVIEWED"
  | "INDEPENDENTLY_TESTED"
  | "MERE_VERIFIED"
  | "REJECTED";

export type MaterialSummary = {
  id: string;
  mere_id: string;
  name: string | null;
  material_type: string;
  material_stage: MaterialStage;
  status: MaterialStatus;
  registration_date: string;
};

export type MaterialDetail = MaterialSummary & {
  internal_reference: string | null;
  claimed_composition: string | null;
  claimed_origin: string | null;
  lot_number: string | null;
  batch_number: string | null;
};

export type Measurement = {
  id: string;
  value_numeric: number | string | null;
  value_text: string | null;
  value_boolean: boolean | null;
  unit: string | null;
  test_method: string | null;
  test_standard: string | null;
  notes: string | null;
  source_type: string;
  verification_status: VerificationStatus;
  created_at: string;
  metric: { name: string; code: string; default_unit: string | null } | null;
  test: { report_number: string | null } | null;
};

export type MaterialTest = {
  id: string;
  report_number: string | null;
  lab_sample_id: string | null;
  test_date: string | null;
  sample_received_date: string | null;
  verification_status: VerificationStatus;
  notes: string | null;
  laboratory: { name: string } | null;
};

const SUMMARY_COLUMNS =
  "id, mere_id, name, material_type, material_stage, status, registration_date";

/** Demonstration records are identified by their "DEMO" name prefix. */
export function isDemoMaterial(m: Pick<MaterialSummary, "name">) {
  return /^DEMO\b/i.test(m.name?.trim() ?? "");
}

// All queries run as the signed-in user, so RLS applies. Each one re-checks
// staff access so that no data function can be called without authorization.

export async function listMaterials() {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select(SUMMARY_COLUMNS)
    .order("mere_id", { ascending: true });
  return { materials: (data ?? []) as MaterialSummary[], error: error?.message ?? null };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID.test(value);
}

export async function getMaterial(id: string) {
  await requireStaff();
  if (!isUuid(id)) return { material: null, measurements: [], tests: [], error: null };

  const supabase = await createClient();
  const [materialRes, measurementsRes, testsRes] = await Promise.all([
    supabase
      .from("materials")
      .select(`${SUMMARY_COLUMNS}, internal_reference, claimed_composition, claimed_origin, lot_number, batch_number`)
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("measurements")
      .select(
        "id, value_numeric, value_text, value_boolean, unit, test_method, test_standard, notes, source_type, verification_status, created_at, metric:metrics(name, code, default_unit), test:tests(report_number)",
      )
      .eq("material_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("tests")
      .select(
        "id, report_number, lab_sample_id, test_date, sample_received_date, verification_status, notes, laboratory:laboratories(name)",
      )
      .eq("material_id", id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    material: (materialRes.data ?? null) as MaterialDetail | null,
    measurements: (measurementsRes.data ?? []) as unknown as Measurement[],
    tests: (testsRes.data ?? []) as unknown as MaterialTest[],
    error: materialRes.error?.message ?? measurementsRes.error?.message ?? testsRes.error?.message ?? null,
  };
}

const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

type CreateResult =
  | { ok: true; id: string; duplicate: boolean }
  | { ok: false; reason: "forbidden" | "failed" };

/**
 * Registers a material as DRAFT. The database generates its id, MERE ID and
 * dates. An identical registration from the last two minutes is treated as an
 * accidental resubmission, and its existing record is returned instead.
 */
export async function createMaterial(input: MaterialInput): Promise<CreateResult> {
  await requireStaff();
  const supabase = await createClient();

  let recent = supabase
    .from("materials")
    .select("id")
    .eq("name", input.name)
    .eq("material_stage", input.material_stage)
    .gte("created_at", new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString());
  for (const column of OPTIONAL_COLUMNS) {
    const value = input[column];
    recent = value === null ? recent.is(column, null) : recent.eq(column, value);
  }

  const { data: existing, error: checkError } = await recent.limit(1).maybeSingle();
  if (checkError) {
    console.error("Material duplicate check failed:", checkError.message);
    return { ok: false, reason: checkError.code === "42501" ? "forbidden" : "failed" };
  }
  if (existing) return { ok: true, id: existing.id, duplicate: true };

  const { data, error } = await supabase
    .from("materials")
    .insert({ ...input, material_type: "CASHMERE", status: "DRAFT" })
    .select("id")
    .single();
  if (error || !data) {
    console.error("Material registration failed:", error?.message);
    return { ok: false, reason: error?.code === "42501" ? "forbidden" : "failed" };
  }

  return { ok: true, id: data.id, duplicate: false };
}
