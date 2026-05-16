"use client";

import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { deleteQuestion, updateQuestion } from "@/actions/questions";
import { toast } from "sonner";

export function QuestionRow({ question }: { question: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    order_no: question.order_no,
    category: question.category,
    question_en: question.question_en,
    question_kh: question.question_kh
  });

  const handleUpdate = async () => {
    try {
      await updateQuestion(question.id, formData);
      setIsEditing(false);
      toast.success("Question updated!");
    } catch (error) {
      toast.error("Failed to update question");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(question.id);
      toast.success("Question deleted!");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input 
            type="number" 
            value={formData.order_no} 
            onChange={e => setFormData({ ...formData, order_no: parseInt(e.target.value) })}
            className="w-20"
          />
        </TableCell>
        <TableCell>
          <select 
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Instructional Skills">Instructional Skills</option>
            <option value="Classroom Management">Classroom Management</option>
            <option value="Student Engagement">Student Engagement</option>
            <option value="Professionalism">Professionalism</option>
            <option value="General">General</option>
          </select>
        </TableCell>
        <TableCell>
          <Input 
            value={formData.question_en} 
            onChange={e => setFormData({ ...formData, question_en: e.target.value })}
          />
        </TableCell>
        <TableCell>
          <Input 
            value={formData.question_kh} 
            onChange={e => setFormData({ ...formData, question_kh: e.target.value })}
          />
        </TableCell>
        <TableCell className="text-right flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={handleUpdate} className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="text-gray-500">
            <X className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{question.order_no}</TableCell>
      <TableCell className="text-blue-600 font-medium">{question.category}</TableCell>
      <TableCell>{question.question_en}</TableCell>
      <TableCell>{question.question_kh}</TableCell>
      <TableCell className="text-right flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
