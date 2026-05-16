"use server";

import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  const [campuses, evaluations, answers] = await Promise.all([
    prisma.campus.findMany(),
    prisma.evaluation.findMany({ include: { class: true, teacher: true } }),
    prisma.evaluationAnswer.findMany({ include: { evaluation: { include: { class: true } } } }),
  ]);

  // Submissions per campus
  const submissionsPerCampus = campuses.map(campus => {
    const count = evaluations.filter(e => e.class.campus_id === campus.id).length;
    return { name: campus.code, count };
  });

  // Average score per campus
  const scorePerCampus = campuses.map(campus => {
    const campusAnswers = answers.filter(a => a.evaluation.class.campus_id === campus.id);
    const avg = campusAnswers.length > 0 
      ? campusAnswers.reduce((sum, a) => sum + a.score, 0) / campusAnswers.length 
      : 0;
    return { name: campus.code, score: Number(avg.toFixed(2)) };
  });

  return { submissionsPerCampus, scorePerCampus, totalSubmissions: evaluations.length };
}
