"use server";

import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function submitEvaluation(data: {
  class_id: string;
  teacher_id: string;
  answers: { question_id: string; score: number }[];
  comment?: string;
}) {
  const token = randomUUID();

  const evaluation = await prisma.evaluation.create({
    data: {
      class_id: data.class_id,
      teacher_id: data.teacher_id,
      token,
      answers: {
        createMany: {
          data: data.answers.map(ans => ({
            question_id: ans.question_id,
            score: ans.score,
          }))
        }
      },
      ...(data.comment && data.comment.trim() !== "" ? {
        comments: {
          create: {
            comment: data.comment.trim()
          }
        }
      } : {})
    }
  });

  return { success: true, token: evaluation.token };
}
