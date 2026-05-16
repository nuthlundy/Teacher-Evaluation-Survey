"use server";

import { revalidatePath } from "next/cache";

export async function clearSystemCache() {
  revalidatePath("/", "layout");
  return { success: true };
}
