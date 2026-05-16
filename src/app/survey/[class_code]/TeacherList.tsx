"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function TeacherList({ 
  classCode, 
  classId, 
  teachers 
}: { 
  classCode: string; 
  classId: string;
  teachers: any[];
}) {
  const [completedEvals, setCompletedEvals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const completed: Record<string, boolean> = {};
    teachers.forEach(t => {
      if (localStorage.getItem(`eval_${classId}_${t.id}`)) {
        completed[t.id] = true;
      }
    });
    setCompletedEvals(completed);
  }, [classId, teachers]);

  if (teachers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        No teachers available for this class.
      </div>
    );
  }

  return (
    <>
      {teachers.map(teacher => {
        const isCompleted = completedEvals[teacher.id];

        if (isCompleted) {
          return (
            <Button key={teacher.id} variant="outline" disabled className="w-full justify-between h-16 text-left px-6 text-base font-medium border-green-200 bg-green-50/50 opacity-100">
              <div className="flex flex-col items-start text-gray-700">
                <span>{teacher.teacher_name}</span>
                <span className="text-xs font-normal">{teacher.teacher_code}</span>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold">Completed</span>
              </div>
            </Button>
          );
        }

        return (
          <Link key={teacher.id} href={`/survey/${classCode}/${teacher.id}`} prefetch={false}>
            <Button variant="outline" className="w-full justify-start h-16 text-left px-6 text-base font-medium shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all">
              <div className="flex flex-col items-start">
                <span>{teacher.teacher_name}</span>
                <span className="text-xs text-gray-500 font-normal">{teacher.teacher_code}</span>
              </div>
            </Button>
          </Link>
        );
      })}
    </>
  );
}
