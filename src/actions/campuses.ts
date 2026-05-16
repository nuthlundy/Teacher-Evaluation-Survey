"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCampuses() {
  return await prisma.campus.findMany({ orderBy: { name: "asc" } });
}

export async function createCampus(data: { name: string; code: string }) {
  await prisma.campus.create({ data });
  revalidatePath("/admin/campuses");
}

export async function deleteCampus(id: string) {
  await prisma.campus.delete({ where: { id } });
  revalidatePath("/admin/campuses");
}
