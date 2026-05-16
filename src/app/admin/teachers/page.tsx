import { Suspense } from "react";
import { getTeachers, createTeacher, deleteTeacher } from "@/actions/teachers";
import { getCampuses } from "@/actions/campuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { BulkImportTeachers } from "@/components/admin/BulkImportTeachers";

async function TeachersTable() {
  const teachers = await getTeachers();
  
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">Existing Teachers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Campus</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 h-24">
                  No teachers found.
                </TableCell>
              </TableRow>
            )}
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.teacher_code}</TableCell>
                <TableCell>{teacher.teacher_name}</TableCell>
                <TableCell className="text-slate-500">{teacher.subject || "N/A"}</TableCell>
                <TableCell>
                  {teacher.campuses && teacher.campuses.length > 0 
                    ? teacher.campuses.map(c => c.name).join(", ") 
                    : <span className="text-slate-400 italic">No campus assigned</span>}
                </TableCell>
                <TableCell className="text-right">
                  <form action={async () => {
                    "use server";
                    await deleteTeacher(teacher.id);
                  }}>
                    <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
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

import { AddTeacherForm } from "@/components/admin/AddTeacherForm";

// ... existing code ...

export default async function TeachersPage() {
  const campuses = await getCampuses();

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Teachers</h1>
        <BulkImportTeachers />
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Add New Teacher</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTeacherForm campuses={campuses} />
        </CardContent>
      </Card>

      <Suspense fallback={<TableSkeleton />}>
        <TeachersTable />
      </Suspense>
    </div>
  );
}
