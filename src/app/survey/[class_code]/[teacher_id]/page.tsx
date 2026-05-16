import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SurveyForm from "./SurveyForm";

export default async function EvaluationPage({ params }: { params: Promise<{ class_code: string, teacher_id: string }> }) {
  const { class_code, teacher_id } = await params;

  const [classData, teacherData, questions] = await Promise.all([
    prisma.class.findFirst({ where: { class_code } }),
    prisma.teacher.findUnique({ where: { id: teacher_id } }),
    prisma.evaluationQuestion.findMany({ orderBy: { order_no: "asc" } })
  ]);

  if (!classData || !teacherData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-8 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-2">Teacher Evaluation</h1>
        <p className="text-gray-600 font-medium text-lg">
          Evaluating: <span className="text-gray-900 font-bold">{teacherData.teacher_name}</span> 
          <span className="mx-2">•</span> 
          Class: <span className="text-gray-900 font-bold">{classData.class_code}</span>
        </p>
      </div>

      <SurveyForm 
        classId={classData.id} 
        teacherId={teacherData.id} 
        questions={questions} 
      />
    </div>
  );
}
