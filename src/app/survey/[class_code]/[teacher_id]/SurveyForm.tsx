"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitEvaluation } from "@/actions/survey";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (hasSubmitted) {
    return (
      <Card className="text-center p-12 border-0 ring-1 ring-black/5 shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Submitted</h2>
        <p className="text-gray-600 mb-8">You have already evaluated this teacher. Thank you for your feedback!</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
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
      toast.error("Please answer all questions before submitting.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <Card key={q.id} className="overflow-hidden shadow-sm border-0 ring-1 ring-black/5">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 space-y-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  <span className="text-blue-600 mr-2">{idx + 1}.</span> 
                  {q.question_en}
                </h3>
                <p className="text-gray-600 font-khmer">{q.question_kh}</p>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-2 sm:p-4 border border-gray-100">
                {[1, 2, 3, 4, 5].map(score => (
                  <div key={score} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleScoreChange(q.id, score)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all ${
                        answers[q.id] === score 
                          ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-md" 
                          : "bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-gray-200"
                      }`}
                    >
                      {score}
                    </button>
                    <span className="text-xs text-gray-400 mt-2 font-medium">
                      {score === 1 && "Poor"}
                      {score === 5 && "Excellent"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-black/5">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div>
            <Label htmlFor="comment" className="text-lg font-semibold text-gray-900">Additional Comments (Optional)</Label>
            <p className="text-sm text-gray-500 mb-4 mt-1">មតិយោបល់បន្ថែម (ជាជម្រើស) / Feel free to share any positive feedback or areas for improvement.</p>
          </div>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
            placeholder="Write your comments here..."
          />
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 pb-12">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto px-8 text-lg h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
          ) : "Submit Evaluation"}
        </Button>
      </div>
    </form>
  );
}
