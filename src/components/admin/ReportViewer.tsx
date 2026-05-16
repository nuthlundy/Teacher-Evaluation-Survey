"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ReportData = {
  teacher: any;
  evaluationsCount: number;
  questionStats: any[];
  overallScore: number;
  overallPercentage: number;
  comments: string[];
};

export default function ReportViewer({ data, classId }: { data: ReportData, classId?: string }) {
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Teacher_Report_${data.teacher.teacher_code}`,
  });

  const isAggregated = !classId || classId === "all";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
        </Button>
        <div className="space-x-2">
          <Button onClick={() => handlePrint()} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="w-4 h-4 mr-2" /> Print PDF
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Printable Area */}
        <div ref={componentRef} className="p-10 bg-white text-gray-900 print:p-0 print:shadow-none print:border-0" id="printable-report">
          
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-2">Teacher Evaluation Report</h1>
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">Teacher:</span> {data.teacher.teacher_name} ({data.teacher.teacher_code})
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Campuses:</span> {data.teacher.campuses?.map((c: any) => c.name).join(", ") || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">
                {isAggregated ? "Aggregated Summary (All Classes)" : `Class Report`}
              </p>
              <p className="text-gray-600 font-medium">
                Total Submissions: {data.evaluationsCount}
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex items-center space-x-6 mb-10 p-6 bg-blue-50 rounded-xl">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-900 mb-1">Overall Performance Score</h2>
              <p className="text-blue-700">Combined average across all evaluation metrics.</p>
            </div>
            <div className="text-center bg-white px-6 py-4 rounded-lg shadow-sm border border-blue-100">
              <div className="text-4xl font-extrabold text-blue-600">{data.overallScore} <span className="text-lg text-gray-400 font-medium">/ 5</span></div>
              <div className="text-sm font-bold text-gray-500 mt-1">{data.overallPercentage}%</div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="mb-10">
            <h3 className="text-xl font-bold border-b pb-2 mb-6">Evaluation Metrics</h3>
            <div className="space-y-4">
              {data.questionStats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium text-gray-800">{idx + 1}. {stat.question}</p>
                  </div>
                  <div className="w-48 text-right">
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold w-16 text-center">
                      {stat.avgScore}
                    </span>
                    <span className="inline-block ml-3 text-sm text-gray-500 w-12">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart for Print - Optional, but good for visuals */}
          <div className="mb-10 h-64 print:h-64">
             <h3 className="text-xl font-bold border-b pb-2 mb-6">Metrics Chart</h3>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.questionStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="question" tick={false} />
                 <YAxis domain={[0, 5]} />
                 <Tooltip />
                 <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>

          {/* Comments */}
          {data.comments.length > 0 && (
            <div className="mt-12" style={{ pageBreakInside: "auto" }}>
              <h3 className="text-xl font-bold border-b pb-2 mb-6">Student Comments</h3>
              <div className="space-y-4">
                {data.comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 italic text-sm">
                    "{comment}"
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
