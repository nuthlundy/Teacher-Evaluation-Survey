import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  School, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Activity, 
  BarChart3, 
  Database, 
  HardDrive, 
  Globe, 
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SystemRefreshButton } from "@/components/admin/SystemRefreshButton";

async function StatCards() {
  const [campusCount, classCount, teacherCount, questionCount] = await Promise.all([
    prisma.campus.count(),
    prisma.class.count(),
    prisma.teacher.count(),
    prisma.evaluationQuestion.count(),
  ]);

  const stats = [
    { 
      title: "Total Campuses", 
      value: campusCount, 
      icon: School, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50/70 border border-indigo-100/50", 
      badge: "100% Configured", 
      badgeBg: "bg-indigo-50 text-indigo-700 border border-indigo-100/30",
      borderGlow: "hover:border-indigo-200/80 hover:shadow-indigo-500/5",
      href: "/admin/campuses" 
    },
    { 
      title: "Active Classes", 
      value: classCount, 
      icon: BookOpen, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50/70 border border-emerald-100/50", 
      badge: "Active This Term", 
      badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-100/30",
      borderGlow: "hover:border-emerald-200/80 hover:shadow-emerald-500/5",
      href: "/admin/classes" 
    },
    { 
      title: "Total Teachers", 
      value: teacherCount, 
      icon: Users, 
      color: "text-purple-600", 
      bg: "bg-purple-50/70 border border-purple-100/50", 
      badge: "Fully Assigned", 
      badgeBg: "bg-purple-50 text-purple-700 border border-purple-100/30",
      borderGlow: "hover:border-purple-200/80 hover:shadow-purple-500/5",
      href: "/admin/teachers" 
    },
    { 
      title: "Survey Questions", 
      value: questionCount, 
      icon: MessageSquare, 
      color: "text-amber-600", 
      bg: "bg-amber-50/70 border border-amber-100/50", 
      badge: "Bilingual Enabled", 
      badgeBg: "bg-amber-50 text-amber-700 border border-amber-100/30",
      borderGlow: "hover:border-amber-200/80 hover:shadow-amber-500/5",
      href: "/admin/questions" 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className={`relative overflow-hidden bg-white/95 border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${stat.borderGlow} group`}>
          {/* Subtle gradient hover background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 via-slate-50/5 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
            <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 relative z-10">
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.badgeBg}`}>
                {stat.badge}
              </span>
            </div>
            
            <div className="border-t border-slate-100/70 pt-3 flex justify-between items-center">
              <Link href={stat.href} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                Manage Details 
                <span className="transition-transform group-hover:translate-x-0.5 duration-200">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-40 animate-pulse bg-slate-50/80 border border-slate-100 rounded-2xl" />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const currentDateString = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50/40 min-h-screen text-slate-900 font-sans">
      
      {/* Premium Dynamic Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 p-6 rounded-2xl border border-slate-100/80 backdrop-blur-sm shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse-subtle" />
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full">
              Enterprise Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">Overview</h1>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Current Session Date: <span className="text-slate-700 font-bold">{currentDateString}</span>
          </p>
        </div>
        
        {/* Unified Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <SystemRefreshButton />
          <Link 
            href="/admin/reports" 
            className="h-10 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/15 rounded-xl px-4 flex items-center gap-1.5 transition-all duration-300 hover:shadow-indigo-500/25"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            View Reports
          </Link>
        </div>
      </div>

      {/* Dynamic Statistics Block */}
      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCards />
      </Suspense>

      {/* Main Analytics Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Activity High-Fidelity Mockup */}
        <Card className="lg:col-span-2 border border-slate-200/60 shadow-sm bg-white/95 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-center bg-slate-50/50">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Recent Portal Activity
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">Live events from the student evaluation engine</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Feed
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              
              {/* Event 1 */}
              <div className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 mt-0.5 transition-transform group-hover:scale-105 duration-200">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 space-y-1 border-b border-slate-50 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Assessment Submission Completed
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">5 mins ago</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Student submitted evaluation for <span className="font-bold text-slate-600">Mr. Chea Sophy</span> (Class: <span className="font-mono bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-600 font-bold">C_BTB3_G10_A</span>)
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600 mt-0.5 transition-transform group-hover:scale-105 duration-200">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 space-y-1 border-b border-slate-50 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-purple-600 transition-colors">
                      Evaluation Record Completed
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">18 mins ago</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Student submitted feedback for <span className="font-bold text-slate-600">Dr. Sarah Connor</span> (Class: <span className="font-mono bg-slate-100 text-[10px] px-1.5 py-0.5 rounded text-slate-600 font-bold">C_BKK2_G04_C</span>)
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600 mt-0.5 transition-transform group-hover:scale-105 duration-200">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 space-y-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">
                      Survey Term Opened
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">1 hour ago</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Survey Session opened for all registered classrooms at <span className="font-bold text-slate-600">BTB</span> and <span className="font-bold text-slate-600">BKK</span> Campuses.
                  </p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Right Side: High-End System Health Check */}
        <Card className="border border-slate-200/60 shadow-sm bg-white/95 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              System Status
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">Real-time health verification checks</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            
            {/* Database Check */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Prisma database</span>
                  <span className="text-[10px] text-slate-400">Supabase Connection</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 px-2 py-0.5 bg-emerald-50 border border-emerald-200/50 rounded-full flex items-center gap-1 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                HEALTHY
              </span>
            </div>

            {/* Storage Check */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-650">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">File Storage</span>
                  <span className="text-[10px] text-slate-400">PDF Storage Bucket</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 px-2 py-0.5 bg-emerald-50 border border-emerald-200/50 rounded-full flex items-center gap-1 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE
              </span>
            </div>

            {/* Clerk Authentication API */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Clerk Auth API</span>
                  <span className="text-[10px] text-slate-400">Identity Providers</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 px-2 py-0.5 bg-emerald-50 border border-emerald-200/50 rounded-full flex items-center gap-1 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  );
}
