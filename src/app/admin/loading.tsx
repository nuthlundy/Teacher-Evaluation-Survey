import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-6xl animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
        <div className="h-10 w-32 bg-slate-200 rounded"></div>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-100">
        <CardHeader>
          <div className="h-6 w-32 bg-slate-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 w-full bg-slate-50 rounded border border-slate-100"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
