"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SurveyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-slate-50 to-purple-50/60 flex items-center justify-center p-4 sm:p-6 text-slate-900 font-sans">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 p-8 animate-scale-in">
        <CardContent className="flex flex-col items-center space-y-6 pt-6 p-0 text-center">
          
          {/* Warning Icon Container */}
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm animate-pulse-subtle">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          {/* Bilingual content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Connection Issue</h1>
            <h2 className="text-sm font-semibold text-indigo-600 font-khmer">មានបញ្ហាការភ្ជាប់បណ្ដាញ</h2>
            
            <p className="text-sm text-slate-500 pt-3 leading-relaxed">
              We couldn't connect to the survey server. Traffic might be temporarily high. Please try again.
            </p>
            <p className="text-xs text-slate-400 font-khmer pt-1.5 leading-normal max-w-xs mx-auto antialiased">
              ប្រព័ន្ធមិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ។ ចរាចរណ៍បណ្ដាញអាចមានភាពមមាញឹកខ្លាំង។ សូមព្យាយាមឡើងវិញ។
            </p>
          </div>

          {/* Action button */}
          <div className="w-full pt-2">
            <Button 
              onClick={() => reset()} 
              className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again / ព្យាយាមឡើងវិញ
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
