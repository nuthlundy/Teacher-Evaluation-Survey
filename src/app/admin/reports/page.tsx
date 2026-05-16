import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

async function ReportsTable() {
  const teachers = await prisma.teacher.findMany({
    take: 100, // Limit to prevent connection pool overflow
    include: { campuses: true, class_teachers: { include: { class: true } } },
    orderBy: { teacher_name: "asc" }
  });

  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">Generate Teacher Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Campus</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.teacher_code}</TableCell>
                <TableCell>{teacher.teacher_name}</TableCell>
                <TableCell>
                  {teacher.campuses?.map(c => c.name).join(", ") || "N/A"}
                </TableCell>
                <TableCell>
                  {teacher.class_teachers.length > 0 
                    ? teacher.class_teachers.map(ct => ct.class.class_code).join(", ") 
                    : <span className="text-slate-400 italic">No assigned classes</span>}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/reports/view?teacherId=${teacher.id}&classId=all`}>
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">Summary Report</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {teachers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                  No teachers found.
                </TableCell>
              </TableRow>
            )}
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
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse"></div>
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

export default function ReportsIndexPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Report Generation Engine</h1>
        <Link href="/admin/reports/batch">
          <Button variant="outline" className="shadow-sm font-medium border-slate-200">Batch Export</Button>
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ReportsTable />
      </Suspense>
    </div>
  );
}
