"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getQuestions() {
  return await prisma.evaluationQuestion.findMany({
    orderBy: { order_no: "asc" },
  });
}

export async function createQuestion(data: { category: string; question_en: string; question_kh: string; order_no: number }) {
  await prisma.evaluationQuestion.create({ data });
  revalidatePath("/admin/questions");
}

export async function updateQuestion(id: string, data: { category: string; question_en: string; question_kh: string; order_no: number }) {
  await prisma.evaluationQuestion.update({ where: { id }, data });
  revalidatePath("/admin/questions");
}
export async function deleteQuestion(id: string) {
  await prisma.evaluationQuestion.delete({ where: { id } });
  revalidatePath("/admin/questions");
}
