"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const [classCode, setClassCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (classCode.trim()) {
      router.push(`/survey/${classCode.trim()}`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl border-0 ring-1 ring-black/5 mx-auto">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl sm:text-3xl text-blue-700 tracking-tight">Teacher Evaluation</CardTitle>
          <CardDescription className="text-sm sm:text-base">Enter your class code to start the survey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="e.g. C_BKK2_G04_C"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="h-14 text-center text-lg sm:text-xl uppercase tracking-wider font-semibold shadow-inner"
                required
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Secret Admin Entrance */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <a href="/admin" className="text-xs text-slate-400">Admin</a>
      </div>
    </div>
  );
}
