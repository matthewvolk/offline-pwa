"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { equipmentFormSchema } from "@/schemas";

export async function submitEquipmentForm(
  _prevState: unknown,
  formData: FormData,
) {
  /**
   * @todo add date field on submission
   */

  const submission = parseWithZod(formData, { schema: equipmentFormSchema });

  console.dir(submission, { depth: null });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return submission.reply();
}
