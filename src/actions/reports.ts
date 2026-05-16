"use server";

import { prisma } from "@/lib/prisma";

export async function getReportData(teacherId: string, classId?: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { campuses: true }
  });

  if (!teacher) throw new Error("Teacher not found");

  const whereClause: any = { teacher_id: teacherId };
  if (classId && classId !== "all") {
    whereClause.class_id = classId;
  }

  const evaluations = await prisma.evaluation.findMany({
    where: whereClause,
    include: {
      class: true,
      answers: {
        include: { question: true }
      },
      comments: true,
    }
  });

  const questions = await prisma.evaluationQuestion.findMany({ orderBy: { order_no: "asc" } });

  // Aggregate scores
  const questionStats = questions.map(q => {
    const answers = evaluations.flatMap(e => e.answers).filter(a => a.question_id === q.id);
    const avg = answers.length > 0 ? answers.reduce((sum, a) => sum + a.score, 0) / answers.length : 0;
    const percentage = (avg / 5) * 100;
    return {
      question: q.question_en,
      avgScore: Number(avg.toFixed(2)),
      percentage: Number(percentage.toFixed(1)),
      count: answers.length
    };
  });

  const overallScore = questionStats.length > 0 && questionStats.some(q => q.count > 0)
    ? questionStats.reduce((sum, q) => sum + q.avgScore, 0) / questionStats.length 
    : 0;

  const comments = evaluations.flatMap(e => e.comments.map(c => c.comment)).filter(c => c && c.trim() !== "");

  return {
    teacher,
    evaluationsCount: evaluations.length,
    questionStats,
    overallScore: Number(overallScore.toFixed(2)),
    overallPercentage: Number(((overallScore / 5) * 100).toFixed(1)),
    comments
  };
}
