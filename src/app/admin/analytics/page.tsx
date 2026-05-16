import { getAnalyticsData } from "@/actions/analytics";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium shadow-sm">
          Total Submissions: {data.totalSubmissions}
        </div>
      </div>
      
      <AnalyticsCharts data={data} />
    </div>
  );
}
