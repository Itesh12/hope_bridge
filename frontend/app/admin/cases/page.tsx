"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  FileText,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AllCasesAdmin() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchCases = async () => {
    try {
      const url = filter === "all" ? "/admin/cases" : `/admin/cases?status=${filter}`;
      const res = await api.get(url);
      setCases(res.data.cases);
    } catch (error) {
      console.error("Failed to fetch all cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [filter]);

  if (loading) {
    return (
       <div className="space-y-4">
         {[...Array(5)].map((_, i) => (
           <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
         ))}
       </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[10px] font-black underline-offset-4">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[10px] font-black">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-50 text-amber-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[10px] font-black">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Case Repository</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Management of All Platform Content</p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-1 flex gap-1">
               {['all', 'pending', 'approved', 'rejected'].map((f) => (
                  <button 
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                     {f}
                  </button>
               ))}
            </div>
            <button className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
               <Search className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c) => (
          <div key={c._id} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] hover:shadow-emerald-900/5 transition-all group overflow-hidden relative">
            <div className="flex items-start justify-between mb-6">
               <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shadow-inner">
                  {c.patientImage ? (
                     <img src={c.patientImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300 uppercase font-black text-xl">
                        {c.patientName[0]}
                     </div>
                  )}
               </div>
               {getStatusBadge(c.verificationStatus)}
            </div>

            <div className="space-y-4">
               <div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors uppercase">{c.patientName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Creator: {c.createdBy?.name || "Member"}</p>
               </div>
               
               <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Raised</p>
                     <p className="text-sm font-black text-slate-900">₹{c.raisedAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                     <p className="text-sm font-black text-slate-900">₹{c.targetAmount.toLocaleString("en-IN")}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                     <Clock className="w-3.5 h-3.5 text-slate-300" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link 
                     href={`/cases/${c._id}`}
                     className="px-6 h-10 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                  >
                     Manage <Eye className="w-3.5 h-3.5" />
                  </Link>
               </div>
            </div>

            {/* Rejection indicator if approriate */}
            {c.verificationStatus === 'rejected' && (
               <div className="mt-4 p-4 rounded-2xl bg-red-50/50 border border-red-100 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-red-600/70 overflow-hidden line-clamp-2">Reason: {c.rejectionReason}</p>
               </div>
            )}
            
            {/* Visual background element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
