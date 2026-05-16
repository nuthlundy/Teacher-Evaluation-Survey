import { prisma } from "@/lib/prisma";
import BatchExportForm from "@/components/admin/BatchExportForm";

export default async function BatchExportPage() {
  const campuses = await prisma.campus.findMany({
    include: { classes: true }
  });
  const teachers = await prisma.teacher.findMany({
    orderBy: { teacher_name: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Batch Export Analytics</h1>
      <BatchExportForm campuses={campuses} teachers={teachers} />
    </div>
  );
}
