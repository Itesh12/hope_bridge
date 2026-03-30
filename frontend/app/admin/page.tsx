"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
         {[...Array(4)].map((_, i) => (
           <div key={i} className="h-32 bg-slate-100 rounded-[32px]" />
         ))}
       </div>
    );
  }

  const statCards = [
    { 
      label: "Total Cases", 
      value: stats?.totalCases || 0, 
      icon: FileText, 
      color: "bg-blue-50 text-blue-600",
      trend: "+12%",
      isPositive: true
    },
    { 
      label: "Pending Review", 
      value: stats?.pendingCases || 0, 
      icon: Clock, 
      color: "bg-amber-50 text-amber-600",
      trend: "4 Required",
      isPositive: false
    },
    { 
      label: "Total Raised", 
      value: `₹${(stats?.totalRaised || 0).toLocaleString("en-IN")}`, 
      icon: TrendingUp, 
      color: "bg-emerald-50 text-emerald-600",
      trend: "+24%",
      isPositive: true
    },
    { 
      label: "Total Users", 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: "bg-purple-50 text-purple-600",
      trend: "+8%",
      isPositive: true
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
         <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
         <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-time Platform Analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[32px] overflow-hidden group hover:shadow-emerald-900/5 transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                   <stat.icon className="w-7 h-7" />
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                   {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : null}
                   {stat.trend}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Row: Mini Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Platform Performance</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Case Verification Speed: 1.2h Average</p>
               </div>
               <div className="mt-12 flex gap-12">
                  <div>
                     <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Approved Cases</p>
                     <p className="text-4xl font-black">{stats?.approvedCases || 0}</p>
                  </div>
                  <div className="w-px bg-slate-700 h-16 self-center" />
                  <div>
                     <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">Rejected Cases</p>
                     <p className="text-4xl font-black">{stats?.rejectedCases || 0}</p>
                  </div>
               </div>
            </div>
            {/* Geometric abstract background */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/20 rounded-full blur-[100px]" />
            <div className="absolute right-10 top-10 w-40 h-40 bg-blue-600/10 rounded-full blur-[80px]" />
         </div>

         <div className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 uppercase tracking-widest text-xs">Compliance Status</h3>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                     <p className="text-sm font-bold text-slate-600">KYC Verification Active</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                     <p className="text-sm font-bold text-slate-600">Cloudinary Media Secure</p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                     <Clock className="w-5 h-5" />
                     <p className="text-sm font-bold">Audit Logs (Coming Soon)</p>
                  </div>
               </div>
            </div>
            <button className="w-full h-14 bg-slate-50 hover:bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all mt-10">
               Generate Platform Report
            </button>
         </div>
      </div>
    </div>
  );
}
