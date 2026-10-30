"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkStaff, requireStaff } from "@/lib/auth";
import { parseMaterialForm, type MaterialFormErrors, type MaterialFormValues } from "@/lib/material-form";
import { createMaterial } from "@/lib/materials";

export type RegisterState = {
  attempt: number;
  error: string | null;
  fieldErrors: MaterialFormErrors;
  values: MaterialFormValues;
};

const SESSION_ENDED =
  "Your session has ended, so nothing was saved. Your entries are still here: sign in again in another tab, then return here and resubmit.";

const FAILURE_MESSAGES = {
  forbidden: "Your account does not have permission to register materials. Your entries have not been saved.",
  failed: "The material could not be saved. Your entries are still here, so you can try again.",
};

export async function registerMaterial(prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const attempt = prev.attempt + 1;
  const { values, errors, input } = parseMaterialForm(formData);

  // A lapsed session keeps the form and its entries, so the user can sign back
  // in and resubmit. Accounts without staff access are sent away by requireStaff.
  const access = await checkStaff();
  if (!access.ok && access.reason === "signed-out") {
    return { attempt, error: SESSION_ENDED, fieldErrors: {}, values };
  }
  await requireStaff();

  if (!input) {
    return { attempt, error: "Please correct the highlighted fields.", fieldErrors: errors, values };
  }

  const result = await createMaterial(input);
  if (!result.ok) {
    return { attempt, error: FAILURE_MESSAGES[result.reason], fieldErrors: {}, values };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/materials/${result.id}?registered=${result.duplicate ? "existing" : "new"}`);
}
