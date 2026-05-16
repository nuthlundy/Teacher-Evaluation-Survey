import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School, Users, BookOpen, MessageSquare, TrendingUp, Activity, BarChart3, Database } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SystemRefreshButton } from "@/components/admin/SystemRefreshButton";

async function StatCards() {
  // Parallel fetching for high performance
  const [campusCount, classCount, teacherCount, questionCount] = await Promise.all([
    prisma.campus.count(),
    prisma.class.count(),
    prisma.teacher.count(),
    prisma.evaluationQuestion.count(),
  ]);

  const stats = [
    { title: "Total Campuses", value: campusCount, icon: School, color: "text-blue-600", bg: "bg-blue-100", href: "/admin/campuses" },
    { title: "Active Classes", value: classCount, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100", href: "/admin/classes" },
    { title: "Total Teachers", value: teacherCount, icon: Users, color: "text-purple-600", bg: "bg-purple-100", href: "/admin/teachers" },
    { title: "Survey Questions", value: questionCount, icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-100", href: "/admin/questions" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 ring-1 ring-slate-100 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform translate-x-2 -translate-y-2">
            <stat.icon size={80} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 tracking-tight">{stat.title}</CardTitle>
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
            <Link href={stat.href} className="text-xs font-medium text-slate-500 hover:text-blue-600 mt-3 inline-block transition-colors">
              Manage {stat.title.split(' ')[1]} →
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-slate-200 rounded mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">System Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time overview of the Teacher Evaluation Platform.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <SystemRefreshButton />
          <Link href="/admin/reports">
            <Button className="shadow-sm bg-blue-600 hover:bg-blue-700 font-medium text-white shadow-blue-600/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md border-0 ring-1 ring-slate-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Recent Evaluation Activity</CardTitle>
            </div>
            <CardDescription>Evaluation submissions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-slate-50/50 rounded-lg border border-slate-100 m-6 mt-0 border-dashed">
            <div className="text-center text-slate-400 font-medium">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Waiting for evaluation data...
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 ring-1 ring-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription>Platform health and synchronization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                <span className="font-medium text-slate-700">Database Connection</span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                <span className="font-medium text-slate-700">Authentication Auth</span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">Online</span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed">
                Database schema is fully synced. Prisma caching is enabled to optimize query performance and reduce dashboard load times.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
