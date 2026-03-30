"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  FileText, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Bell
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Review Queue", icon: ClipboardCheck, href: "/admin/review" },
    { name: "All Cases", icon: FileText, href: "/admin/cases" },
    { name: "Users", icon: Users, href: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">
              Hope<span className="text-emerald-600">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-900/5" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            <span className="font-bold text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Admin Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
           <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
             {menuItems.find(item => item.href === pathname)?.name || "Admin Panel"}
           </h1>
           
           <div className="flex items-center gap-6">
              <button className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
              
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 uppercase leading-none">{user.name}</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Super Admin</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase">
                    {user.name[0]}
                 </div>
              </div>
           </div>
        </header>

        <main className="p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
