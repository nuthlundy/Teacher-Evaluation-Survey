import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4 text-gray-900">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Teacher Evaluation</h1>
          <p className="text-gray-600 font-medium text-lg">
            Class {classData.class_code} <span className="mx-2">•</span> {classData.campus.name}
          </p>
        </div>

        <Card className="shadow-lg border-0 ring-1 ring-black/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Select Your Teacher</CardTitle>
            <CardDescription className="text-sm">
              Your feedback is 100% anonymous and helps us improve our teaching quality.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-2">
            <TeacherList classCode={class_code} classId={classData.id} teachers={teachers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
