import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, School } from "lucide-react";

export const revalidate = 60; // Enable Stale-While-Revalidate (SWR) for 60 seconds

import { TeacherList } from "./TeacherList";

export default async function SurveyClassLanding({ params }: { params: Promise<{ class_code: string }> }) {
  const { class_code } = await params;
  
  const classData = await prisma.class.findFirst({
    where: { class_code },
    include: {
      campus: true,
      class_teachers: {
        include: { teacher: true }
      }
    }
  });

  if (!classData) {
    notFound();
  }

  // Fallback: If no specific class_teachers are assigned, just show all teachers in the same campus
  let teachers = classData.class_teachers.map(ct => ct.teacher);
  if (teachers.length === 0) {
    teachers = await prisma.teacher.findMany({
      where: { campuses: { some: { id: classData.campus_id } } }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-slate-50 to-purple-50/60 flex items-center justify-center p-4 sm:p-6 text-slate-900 font-sans">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Visual Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10 mb-4 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            Academic Quality Survey • ការស្ទង់មតិគុណភាពសិក្សា
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
            Teacher Evaluation
          </h1>
          <p className="text-sm font-khmer text-slate-500 font-medium mt-1">
            ការវាយតម្លៃលើសកម្មភាពបង្រៀនរបស់គ្រូ
          </p>

          {/* Class Code & Campus Badges */}
          <div className="flex items-center gap-2.5 mt-4 py-1.5 px-4 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-sm text-sm text-slate-600 font-medium">
            <span className="font-bold text-indigo-600 tracking-wider uppercase flex items-center gap-1">
              <School className="w-3.5 h-3.5" />
              {classData.class_code}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700">{classData.campus.name}</span>
          </div>
        </div>

        {/* Selection Card Container */}
        <Card className="shadow-2xl border border-slate-100 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="flex flex-col items-center space-y-1 mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">Select Your Teacher</h2>
            <h3 className="text-sm sm:text-base text-indigo-600 font-semibold font-khmer">សូមជ្រើសរើសគ្រូបង្រៀនរបស់អ្នក</h3>
            
            <p className="text-sm text-slate-500 max-w-sm pt-3 leading-relaxed">
              Your feedback is 100% anonymous and confidential. It helps us improve our teaching quality.
            </p>
            <p className="text-xs text-slate-400 font-khmer pt-1 max-w-xs leading-normal">
              រាល់ការវាយតម្លៃរបស់អ្នកនឹងត្រូវបានរក្សាការសម្ងាត់ និងអនាមិក ១០០% ដើម្បីរួមចំណែកលើកកម្ពស់គុណភាពអប់រំ។
            </p>
          </div>

          <div className="grid gap-3 pt-2">
            <TeacherList classCode={class_code} classId={classData.id} teachers={teachers} />
          </div>
        </Card>
      </div>
    </div>
  );
}
