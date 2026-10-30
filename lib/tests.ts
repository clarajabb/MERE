import "server-only";

import { requireStaff } from "@/lib/auth";
import { isUuid, type MaterialStage, type MaterialSummary } from "@/lib/materials";
import { createClient } from "@/lib/supabase/server";
import {
  metricAppliesTo,
  type LaboratoryOption,
  type MeasurementInput,
  type MetricMethodOption,
  type MetricOption,
  type TestInput,
} from "@/lib/test-form";

export async function getMaterialForTest(id: string) {
  await requireStaff();
  if (!isUuid(id)) return { material: null, error: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("id, mere_id, name, material_stage")
    .eq("id", id)
    .maybeSingle();
  return {
    material: (data ?? null) as Pick<MaterialSummary, "id" | "mere_id" | "name" | "material_stage"> | null,
    error: error?.message ?? null,
  };
}

type MetricRecord = Omit<MetricOption, "methods"> & {
  methods: (MetricMethodOption & { active: boolean })[] | null;
};

/** Active metrics for this stage, their active methods, and all laboratories. */
export async function getTestFormOptions(stage: MaterialStage) {
  await requireStaff();
  const supabase = await createClient();

  const [metricsRes, labsRes] = await Promise.all([
    supabase
      .from("metrics")
      .select(
        "id, name, category, default_unit, data_type, description, applicable_stages, methods:metric_methods(id, standard_code, standard_title, edition_year, method_name, active)",
      )
      .eq("active", true)
      .order("name", { ascending: true }),
    supabase.from("laboratories").select("id, name, country").order("name", { ascending: true }),
  ]);

  const metrics: MetricOption[] = ((metricsRes.data ?? []) as unknown as MetricRecord[])
    .filter((metric) => metricAppliesTo(metric, stage))
    .map((metric) => ({
      ...metric,
      methods: (metric.methods ?? []).filter((method) => method.active),
    }));

  return {
    metrics,
    laboratories: (labsRes.data ?? []) as LaboratoryOption[],
    error: metricsRes.error?.message ?? labsRes.error?.message ?? null,
  };
}

const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

type RecentMeasurement = {
  metric_id: string;
  value_numeric: number | string | null;
  value_text: string | null;
  value_boolean: boolean | null;
};

function measurementsSignature(rows: (RecentMeasurement | MeasurementInput)[]) {
  return rows
    .map((m) =>
      [m.metric_id, m.value_numeric === null ? "" : Number(m.value_numeric), m.value_text ?? "", m.value_boolean ?? ""].join("|"),
    )
    .sort()
    .join("\n");
}

type CreateResult =
  | { ok: true; id: string; duplicate: boolean }
  | { ok: false; reason: "forbidden" | "not-installed" | "failed" };

function failure(context: string, error: { code?: string; message: string }): CreateResult {
  console.error(`${context}:`, error.message);
  if (error.code === "42501") return { ok: false, reason: "forbidden" };
  if (error.code === "PGRST202" || error.code === "42883") return { ok: false, reason: "not-installed" };
  return { ok: false, reason: "failed" };
}

/**
 * Saves a test and its measurements through create_test_with_measurements(),
 * which runs as the signed-in user in one transaction and fixes their status at
 * PENDING_REVIEW. An identical test on this material from the last two minutes
 * is treated as an accidental resubmission, and is returned instead.
 */
export async function createTest(materialId: string, input: TestInput): Promise<CreateResult> {
  await requireStaff();
  const supabase = await createClient();

  let recent = supabase
    .from("tests")
    .select("id, measurements(metric_id, value_numeric, value_text, value_boolean)")
    .eq("material_id", materialId)
    .gte("created_at", new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString());
  for (const [column, value] of Object.entries(input.test)) {
    recent = value === null ? recent.is(column, null) : recent.eq(column, value);
  }

  const { data: candidates, error: checkError } = await recent;
  if (checkError) return failure("Test duplicate check failed", checkError);

  const signature = measurementsSignature(input.measurements);
  const existing = ((candidates ?? []) as unknown as { id: string; measurements: RecentMeasurement[] | null }[]).find(
    (test) => measurementsSignature(test.measurements ?? []) === signature,
  );
  if (existing) return { ok: true, id: existing.id, duplicate: true };

  const { data, error } = await supabase.rpc("create_test_with_measurements", {
    p_material_id: materialId,
    p_test: input.test,
    p_measurements: input.measurements,
  });
  if (error || !data) return failure("Test save failed", error ?? { message: "No test id returned" });

  return { ok: true, id: data as string, duplicate: false };
}
