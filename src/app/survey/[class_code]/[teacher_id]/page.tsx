import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  const getInitials = (name: string) => {
    if (!name) return "T";
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-slate-50 to-purple-50/60 pt-6 pb-12 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link
          href={`/survey/${class_code}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all group mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl px-3 py-1.5 bg-white border border-slate-200/60 shadow-sm w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Teachers / ត្រឡប់ទៅបញ្ជីគ្រូ
        </Link>

        {/* Teacher Banner Card */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-4.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl text-white shadow bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 shrink-0">
              {getInitials(teacherData.teacher_name)}
            </div>
            <div className="flex flex-col items-start space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10 mb-1">
                Evaluating Teacher / កំពុងវាយតម្លៃគ្រូបង្រៀន
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">
                {teacherData.teacher_name}
              </h2>
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                ID: {teacherData.teacher_code}
              </span>
            </div>
          </div>

          <div className="h-px md:h-12 w-full md:w-px bg-slate-100" />

          <div className="flex flex-col items-start md:items-end justify-center gap-1 shrink-0">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Code / ថ្នាក់</span>
            <span className="text-base sm:text-lg font-extrabold text-indigo-600 tracking-wider uppercase block bg-indigo-50 border border-indigo-100/30 px-3 py-1 rounded-xl">
              {classData.class_code}
            </span>
          </div>
        </div>

        {/* Survey Form */}
        <SurveyForm 
          classId={classData.id} 
          teacherId={teacherData.id} 
          questions={questions} 
        />
      </div>
    </div>
  );
}
