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
  Settings,
  Menu,
  X
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
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="font-bold text-blue-700 text-xl">Teacher Evaluation</div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/sign-in" />
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className="h-16 flex items-center px-6 bg-slate-950/50 hidden lg:flex">
          <span className="text-xl font-bold text-white tracking-tight">Evaluation Admin</span>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                    : "hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950/50 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/sign-in" />
            <span className="text-sm font-medium text-slate-300">Admin Account</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
