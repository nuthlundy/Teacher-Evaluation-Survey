"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitEvaluation } from "@/actions/survey";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, MessageSquare, AlertTriangle, CheckCircle2, Lock, HelpCircle } from "lucide-react";

type Question = {
  id: string;
  question_en: string;
  question_kh: string;
  order_no: number;
};

type SurveyFormProps = {
  classId: string;
  teacherId: string;
  questions: Question[];
};

export default function SurveyForm({ classId, teacherId, questions }: SurveyFormProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Duplicate prevention via LocalStorage
    const storageKey = `eval_${classId}_${teacherId}`;
    if (localStorage.getItem(storageKey)) {
      setHasSubmitted(true);
    }
  }, [classId, teacherId]);

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <span className="text-sm font-semibold text-slate-500">Loading Evaluation Form...</span>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <Card className="text-center p-8 sm:p-12 border border-slate-100 shadow-2xl max-w-2xl mx-auto rounded-3xl bg-white/95 backdrop-blur-md animate-scale-in">
        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Already Evaluated</h2>
            <h3 className="text-base text-indigo-600 font-semibold font-khmer">បានវាយតម្លៃរួចរាល់</h3>
            
            <p className="text-sm sm:text-base text-slate-500 max-w-sm pt-3 leading-relaxed">
              You have already submitted an evaluation for this teacher. Thank you for helping us maintain high standards.
            </p>
            <p className="text-xs text-slate-400 font-khmer pt-1 max-w-xs leading-normal">
              អ្នកបានផ្ដល់ការវាយតម្លៃសម្រាប់គ្រូបង្រៀនរូបនេះរួចរាល់ហើយ។ សូមអរគុណសម្រាប់ការចូលរួមជួយកែលម្អគុណភាពអប់រំ។
            </p>
          </div>
          <Button 
            onClick={() => router.back()} 
            variant="outline"
            className="px-6 h-12 rounded-xl font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Go Back / ត្រឡប់ក្រោយ
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleScoreChange = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all questions answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error("Please answer all questions before submitting. / សូមឆ្លើយសំណួរទាំងអស់មុនពេលបញ្ជូន។");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([question_id, score]) => ({
        question_id,
        score
      }));

      const res = await submitEvaluation({
        class_id: classId,
        teacher_id: teacherId,
        answers: formattedAnswers,
        comment
      });

      if (res.success) {
        // Save to local storage to prevent duplicate
        localStorage.setItem(`eval_${classId}_${teacherId}`, res.token);
        router.push("/thank-you");
      }
    } catch (error) {
      toast.error("An error occurred while submitting. Please try again.");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const answeredCount = questions.filter(q => answers[q.id]).length;
  const totalCount = questions.length;
  const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  // Custom rating bubble visual themes mapping
  const getRatingStyles = (questionId: string, score: number) => {
    const isSelected = answers[questionId] === score;
    if (!isSelected) {
      return "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-350 shadow-sm";
    }

    switch (score) {
      case 1:
        return "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-100 shadow-md shadow-rose-100 scale-105";
      case 2:
        return "bg-amber-500 text-white border-amber-600 ring-4 ring-amber-100 shadow-md shadow-amber-100 scale-105";
      case 3:
        return "bg-yellow-450 text-slate-900 border-yellow-500 ring-4 ring-yellow-100 shadow-md shadow-yellow-100 scale-105";
      case 4:
        return "bg-teal-500 text-white border-teal-600 ring-4 ring-teal-100 shadow-md shadow-teal-100 scale-105";
      case 5:
        return "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-100 shadow-md shadow-emerald-100 scale-105";
      default:
        return "bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-100 scale-105";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border border-slate-100 px-4 py-3.5 sm:px-6 rounded-2xl shadow-md -mx-1 sm:-mx-2 flex flex-col justify-center gap-1.5 animate-slide-down">
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-slate-700 tracking-tight">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Evaluation Progress / វឌ្ឍនភាពការវាយតម្លៃ
          </span>
          <span className="font-mono bg-indigo-50 text-indigo-750 px-2 py-0.5 rounded-md">
            {answeredCount}/{totalCount} Completed • {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Cards Stack */}
      <div className="space-y-5 pt-2">
        {questions.map((q, idx) => (
          <Card key={q.id} className="overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 bg-white rounded-3xl">
            <CardContent className="p-5 sm:p-7 space-y-5">
              
              {/* Question Header Layout */}
              <div className="flex items-start gap-3.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 tracking-tight leading-snug">
                    {q.question_en}
                  </h3>
                  <p className="text-slate-500 font-khmer text-sm sm:text-base leading-relaxed mt-1 font-normal antialiased">
                    {q.question_kh}
                  </p>
                </div>
              </div>
              
              {/* Semantic Color Radio-styled Rating Selector */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/50">
                {[1, 2, 3, 4, 5].map(score => (
                  <div key={score} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleScoreChange(q.id, score)}
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl font-black text-base sm:text-xl flex items-center justify-center border transition-all duration-350 transform active:scale-95 cursor-pointer ${getRatingStyles(q.id, score)}`}
                    >
                      {score}
                    </button>
                    
                    {/* Bilingual descriptive tag underneath */}
                    <span className="text-[9px] sm:text-xs font-bold mt-2 text-center text-slate-500 block leading-tight font-sans">
                      {score === 1 && "Poor"}
                      {score === 2 && "Fair"}
                      {score === 3 && "Good"}
                      {score === 4 && "V. Good"}
                      {score === 5 && "Excellent"}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-khmer mt-0.5 text-center text-slate-450 block leading-none antialiased">
                      {score === 1 && "ខ្សោយ"}
                      {score === 2 && "មធ្យម"}
                      {score === 3 && "ល្អ"}
                      {score === 4 && "ល្អណាស់"}
                      {score === 5 && "ល្អឥតខ្ចោះ"}
                    </span>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comments Section Card */}
      <Card className="shadow-lg border border-slate-100 bg-white rounded-3xl overflow-hidden mt-4">
        <CardContent className="p-5 sm:p-7 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <Label htmlFor="comment" className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                Additional Comments (Optional)
              </Label>
              <p className="text-xs sm:text-sm text-slate-450 font-khmer leading-relaxed antialiased">
                មតិយោបល់បន្ថែម (ជាជម្រើស) / Share any specific feedback, appreciation, or areas of improvement.
              </p>
            </div>
          </div>
          
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[130px] rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 px-4 py-3.5 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-300 resize-y"
            placeholder="Write your comments here... / សរសេរមតិយោបល់របស់អ្នកនៅទីនេះ..."
          />
        </CardContent>
      </Card>

      {/* Submission Actions */}
      <div className="flex justify-end pt-3 pb-8">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto px-10 text-base sm:text-lg h-14 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-300 active:scale-98 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting / កំពុងបញ្ជូន...
            </>
          ) : (
            <>
              Submit Evaluation / បញ្ជូនការវាយតម្លៃ
            </>
          )}
        </Button>
      </div>

    </form>
  );
}
