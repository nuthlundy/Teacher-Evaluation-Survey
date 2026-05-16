import { Suspense } from "react";
import { getQuestions, createQuestion } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionRow } from "@/components/admin/QuestionRow";

async function QuestionsTable() {
  const questions = await getQuestions();
  
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">Existing Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>English</TableHead>
              <TableHead>Khmer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 h-24">
                  No questions found.
                </TableCell>
              </TableRow>
            )}
            {questions.map((question) => (
              <QuestionRow key={question.id} question={question} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-50 rounded animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function QuestionsPage() {
  // We fetch just enough to know the order_no placeholder instantly, or we could leave it generic.
  // We'll leave it generic so the form renders instantly without waiting for getQuestions().

  const handleCreate = async (formData: FormData) => {
    "use server";
    const category = formData.get("category") as string;
    const question_en = formData.get("question_en") as string;
    const question_kh = formData.get("question_kh") as string;
    const order_no = parseInt(formData.get("order_no") as string, 10);
    
    if (category && question_en && question_kh && !isNaN(order_no)) {
      await createQuestion({ category, question_en, question_kh, order_no });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Questions</h1>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="space-y-2 md:col-span-3">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select id="category" name="category" required className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option value="Instructional Skills">Instructional Skills</option>
                <option value="Classroom Management">Classroom Management</option>
                <option value="Student Engagement">Student Engagement</option>
                <option value="Professionalism">Professionalism</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-4">
              <label htmlFor="question_en" className="text-sm font-medium">Question (English)</label>
              <Input id="question_en" name="question_en" placeholder="e.g., Explains clearly" required />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label htmlFor="question_kh" className="text-sm font-medium">Question (Khmer)</label>
              <Input id="question_kh" name="question_kh" placeholder="e.g., គ្រូពន្យល់មេរៀនបានច្បាស់លាស់។" required />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label htmlFor="order_no" className="text-sm font-medium">Order</label>
              <Input id="order_no" name="order_no" type="number" placeholder="1" required min={1} />
            </div>
            <div className="md:col-span-1">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Suspense fallback={<TableSkeleton />}>
        <QuestionsTable />
      </Suspense>
    </div>
  );
}
