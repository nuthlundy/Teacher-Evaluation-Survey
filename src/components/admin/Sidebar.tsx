"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Campuses", href: "/admin/campuses", icon: School },
  { name: "Classes", href: "/admin/classes", icon: Users },
  { name: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { name: "Questions", href: "/admin/questions", icon: FileText },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-900/60 z-50 flex items-center justify-between px-6 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">Evaluation Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)} 
            className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 border-r border-slate-900/70 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Header Branding */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-900 hidden lg:flex bg-slate-950">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105 duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white tracking-tight leading-none">Evaluation Portal</span>
              <span className="text-[10px] font-semibold text-indigo-400 mt-1 uppercase tracking-wider">Admin Console</span>
            </div>
          </Link>
          <div className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-bold">
            v1.0
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto mt-16 lg:mt-0">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 cursor-pointer
                  ${isActive
                    ? "bg-gradient-to-r from-indigo-500/10 to-indigo-500/0 text-indigo-400 border-l-2 border-indigo-500 shadow-sm shadow-indigo-950/20"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 hover:translate-x-1"
                  }
                `}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors duration-300 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-350"}`} 
                />
                <span className="text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Profile */}
        <div className="p-4 bg-slate-950 border-t border-slate-900 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-3 w-full bg-slate-900/40 p-3 rounded-2xl border border-slate-900/60">
            <UserButton />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate">System Admin</span>
              <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live and Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
