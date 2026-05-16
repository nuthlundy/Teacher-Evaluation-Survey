import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function SurveyClosedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Survey Closed</h1>
          <p className="text-gray-600">The evaluation period has ended and we are no longer accepting submissions.</p>
        </div>
      </div>
    </div>
  );
}
