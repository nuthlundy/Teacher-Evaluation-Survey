"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl border-0 ring-1 ring-red-500/10 mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-slate-900 tracking-tight">Connection Issue</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            We couldn't connect to the server. Traffic might be too high.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={() => reset()} 
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
