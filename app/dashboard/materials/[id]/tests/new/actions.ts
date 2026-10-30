"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkStaff, requireStaff } from "@/lib/auth";
import {
  parseTestForm,
  validateTestForm,
  type RowErrors,
  type TestFormErrors,
  type TestFormValues,
} from "@/lib/test-form";
import { createTest, getMaterialForTest, getTestFormOptions } from "@/lib/tests";

export type TestFormState = {
  attempt: number;
  error: string | null;
  fieldErrors: TestFormErrors;
  rowErrors: Record<string, RowErrors>;
  values: TestFormValues;
};

const SESSION_ENDED =
  "Your session has ended, so nothing was saved. Your entries are still here: sign in again in another tab, then return here and resubmit.";

const FAILURE_MESSAGES = {
  forbidden: "Your account does not have permission to record tests. Your entries have not been saved.",
  "not-installed": "Saving tests is not set up in the database yet, so nothing was saved. Your entries are still here.",
  failed: "The test could not be saved, and no part of it was recorded. Your entries are still here, so you can try again.",
};

/** materialId is bound on the server by the page, and never read from the form. */
export async function registerTest(
  materialId: string,
  prev: TestFormState,
  formData: FormData,
): Promise<TestFormState> {
  const attempt = prev.attempt + 1;
  const { values, rows } = parseTestForm(formData);
  const failed = (error: string): TestFormState => ({ attempt, error, fieldErrors: {}, rowErrors: {}, values });

  const access = await checkStaff();
  if (!access.ok && access.reason === "signed-out") return failed(SESSION_ENDED);
  await requireStaff();

  const { material, error: materialError } = await getMaterialForTest(materialId);
  if (materialError) return failed(FAILURE_MESSAGES.failed);
  if (!material) return failed("This material could not be found, so nothing was saved.");

  const options = await getTestFormOptions(material.material_stage);
  if (options.error) return failed(FAILURE_MESSAGES.failed);

  const { formError, errors, rowErrors, input } = validateTestForm(values, rows, options);
  if (!input) return { attempt, error: formError, fieldErrors: errors, rowErrors, values };

  const result = await createTest(material.id, input);
  if (!result.ok) return failed(FAILURE_MESSAGES[result.reason]);

  revalidatePath(`/dashboard/materials/${material.id}`);
  redirect(`/dashboard/materials/${material.id}?test=${result.duplicate ? "existing" : "new"}`);
}
