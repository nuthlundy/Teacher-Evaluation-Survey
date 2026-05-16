import { Suspense } from "react";
import { getClasses, createClass, deleteClass } from "@/actions/classes";
import { getCampuses } from "@/actions/campuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { BulkImportClasses } from "@/components/admin/BulkImportClasses";

async function ClassesTable() {
  const classes = await getClasses();
  const { getTeachers } = await import("@/actions/teachers");
  const teachers = await getTeachers();
  
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">Existing Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Code</TableHead>
              <TableHead>Campus</TableHead>
              <TableHead>Linked Teachers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 h-24">
                  No classes found.
                </TableCell>
              </TableRow>
            )}
            {classes.map((cls) => {
              // Note: We need to make sure getClasses() includes class_teachers. Let's assume it does or we update it.
              return (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.class_code}</TableCell>
                  <TableCell>{cls.campus?.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {cls.class_teachers && cls.class_teachers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {cls.class_teachers.map(ct => (
                            <span key={ct.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {ct.teacher.teacher_name}
                            </span>
                          ))}
                        </div>
                      )}
                      <form action={async (formData) => {
                        "use server";
                        const { linkTeacherToClass } = await import("@/actions/classes");
                        await linkTeacherToClass(cls.id, formData);
                      }} className="flex items-center gap-2">
                        <select name="teacher_id" className="text-xs p-1 border rounded max-w-[150px]" required>
                          <option value="">+ Link Teacher</option>
                          {teachers.filter(t => t.campuses?.some((c: any) => c.id === cls.campus_id)).map(t => (
                            <option key={t.id} value={t.id}>{t.teacher_name}</option>
                          ))}
                        </select>
                        <Button size="sm" variant="outline" type="submit" className="h-6 text-xs px-2">Link</Button>
                      </form>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={async () => {
                      "use server";
                      await deleteClass(cls.id);
                    }}>
                      <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
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

export default async function ClassesPage() {
  const campuses = await getCampuses();
  const { getTeachers } = await import("@/actions/teachers");
  const teachers = await getTeachers();

  const handleCreate = async (formData: FormData) => {
    "use server";
    const class_code = formData.get("class_code") as string;
    const campus_id = formData.get("campus_id") as string;
    const grade = formData.get("grade") as string;
    const section = formData.get("section") as string;
    const teacher_id = formData.get("teacher_id") as string;
    if (class_code && campus_id && grade && section) {
      await createClass({ class_code, campus_id, grade, section, teacher_id: teacher_id || undefined });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Classes</h1>
        <BulkImportClasses />
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Add New Class</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="class_code" className="text-sm font-medium">Class Code</label>
              <Input id="class_code" name="class_code" placeholder="e.g., C_BKK_G10_A" required />
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
            <div className="space-y-2">
              <label htmlFor="teacher_id" className="text-sm font-medium">Assign Teacher (Optional)</label>
              <select 
                id="teacher_id" 
                name="teacher_id" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.teacher_name} ({t.teacher_code})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="grade" className="text-sm font-medium">Grade</label>
              <Input id="grade" name="grade" placeholder="e.g., G10" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="section" className="text-sm font-medium">Section</label>
              <Input id="section" name="section" placeholder="e.g., A" required />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Suspense fallback={<TableSkeleton />}>
        <ClassesTable />
      </Suspense>
    </div>
  );
}
