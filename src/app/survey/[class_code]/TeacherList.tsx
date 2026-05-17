"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

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

  if (teachers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl font-medium">
        No teachers available for this class.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teachers.map(teacher => {
        const isCompleted = completedEvals[teacher.id];

        if (isCompleted) {
          return (
            <div 
              key={teacher.id} 
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm opacity-90 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5">
                {/* Completed Avatar */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-emerald-600 bg-emerald-100/60 border border-emerald-200 shadow-inner">
                  {getInitials(teacher.teacher_name)}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-slate-500 font-semibold text-base line-through decoration-slate-300">
                    {teacher.teacher_name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider bg-emerald-50/50 border border-emerald-100/50 px-1.5 py-0.5 rounded-md mt-1">
                    ID: {teacher.teacher_code}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 bg-emerald-100/80 border border-emerald-200/50 text-emerald-800 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden font-khmer">រួចរាល់</span>
              </div>
            </div>
          );
        }

        return (
          <Link 
            key={teacher.id} 
            href={`/survey/${classCode}/${teacher.id}`} 
            prefetch={false} 
            className="group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
          >
            <div className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/30 active:bg-indigo-50 transition-all duration-300">
              <div className="flex items-center gap-3.5">
                {/* Active Avatar Placeholder */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-sm bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 transition-transform duration-300 group-hover:scale-105">
                  {getInitials(teacher.teacher_name)}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-slate-800 font-bold text-base group-hover:text-indigo-950 transition-colors">
                    {teacher.teacher_name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded-md mt-1 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                    ID: {teacher.teacher_code}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-100/50 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
