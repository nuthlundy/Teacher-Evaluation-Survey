import { getReportData } from "@/actions/reports";
import { notFound } from "next/navigation";
import ReportViewer from "@/components/admin/ReportViewer";

export default async function ReportViewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const teacherId = params.teacherId as string;
  const classId = params.classId as string;

  if (!teacherId) {
    notFound();
  }

  const reportData = await getReportData(teacherId, classId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ReportViewer data={reportData} classId={classId} />
    </div>
  );
}
