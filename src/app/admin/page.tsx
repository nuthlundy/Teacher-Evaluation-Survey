import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School, Users, BookOpen, MessageSquare, TrendingUp, Activity, BarChart3, Database } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { SystemRefreshButton } from "@/components/admin/SystemRefreshButton";

async function StatCards() {
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <Link href={stat.href} className="text-xs text-blue-600 hover:underline mt-1 block">
              View all →
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-32 animate-pulse bg-slate-50" />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Welcome back to the admin portal.</p>
        </div>
        <div className="flex gap-2">
          <SystemRefreshButton />
          <Link href="/admin/reports" className={buttonVariants({ variant: "default", size: "default" })}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Link>
        </div>
      </div>

      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed rounded-lg">
            Analytics visualization pending
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
              <span className="text-sm font-medium">Database</span>
              <span className="text-xs font-bold text-emerald-600 px-2 py-1 bg-emerald-100 rounded">HEALTHY</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
              <span className="text-sm font-medium">Storage</span>
              <span className="text-xs font-bold text-emerald-600 px-2 py-1 bg-emerald-100 rounded">HEALTHY</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
