import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
          <p className="text-gray-600">Your evaluation has been submitted successfully.</p>
          <p className="text-gray-500 text-sm font-khmer pt-2">អរគុណសម្រាប់ការវាយតម្លៃរបស់អ្នក។</p>
        </div>
        <div className="pt-4">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
