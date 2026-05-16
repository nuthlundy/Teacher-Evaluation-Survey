"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { upsertTeacher } from "@/actions/teachers";

export function AddTeacherForm({ campuses }: { campuses: { id: string, name: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const teacher_code = formData.get("teacher_code") as string;
    const teacher_name = formData.get("teacher_name") as string;
    const subject = formData.get("subject") as string;
    const campus_id = formData.get("campus_id") as string;
    
    if (teacher_code && teacher_name && campus_id) {
      try {
        await upsertTeacher({ teacher_code, teacher_name, campus_id, subject });
        toast.success("Teacher updated/linked successfully");
        formRef.current?.reset();
      } catch (error) {
        toast.error("Failed to add or update teacher.");
        console.error(error);
      }
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div className="space-y-2">
        <label htmlFor="teacher_code" className="text-sm font-medium">Teacher ID</label>
        <Input id="teacher_code" name="teacher_code" placeholder="e.g., T_101" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="teacher_name" className="text-sm font-medium">Full Name</label>
        <Input id="teacher_name" name="teacher_name" placeholder="e.g., John Doe" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">Subject (Optional)</label>
        <Input id="subject" name="subject" placeholder="e.g., Math" />
      </div>
      <div className="space-y-2">
        <label htmlFor="campus_id" className="text-sm font-medium">Campus</label>
        <select 
          id="campus_id" 
          name="campus_id" 
          required 
          className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Campus</option>
          {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add / Link</Button>
    </form>
  );
}
