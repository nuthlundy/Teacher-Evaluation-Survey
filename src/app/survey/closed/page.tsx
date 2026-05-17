import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarX } from "lucide-react";

export default function SurveyClosedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-slate-50 to-purple-50/60 flex items-center justify-center p-4 sm:p-6 text-slate-900 font-sans">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 p-8 text-center space-y-6 animate-scale-in">
        
        {/* Closed Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-sm">
          <CalendarX className="w-8 h-8" />
        </div>
        
        {/* Bilingual explanation */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Survey Closed</h1>
          <h2 className="text-sm font-semibold text-indigo-600 font-khmer">ការវាយតម្លៃត្រូវបានបិទ</h2>
          
          <p className="text-sm text-slate-500 pt-3 leading-relaxed">
            The evaluation period has ended. We are no longer accepting submissions for this academic cycle.
          </p>
          <p className="text-xs text-slate-400 font-khmer pt-1.5 leading-normal max-w-xs mx-auto">
            រយៈពេលកំណត់នៃការវាយតម្លៃត្រូវបានបញ្ចប់ហើយ។ យើងមិនទទួលយកការឆ្លើយសាកសួរទៀតទេសម្រាប់វគ្គសិក្សានេះ។
          </p>
        </div>

        {/* Home Link */}
        <div className="pt-4">
          <Link href="/">
            <Button className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 transition-all cursor-pointer">
              Return Home / ត្រឡប់ទៅទំព័រដើម
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
