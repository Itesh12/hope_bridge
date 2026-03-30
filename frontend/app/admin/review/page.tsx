"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Eye,
  ShieldCheck,
  Search,
  Filter
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReviewQueue() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = async () => {
    try {
      const res = await api.get("/admin/cases?status=pending");
      setCases(res.data.cases);
    } catch (error) {
      console.error("Failed to fetch pending cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !rejectionReason.trim()) {
       alert("Please provide a rejection reason");
       return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/admin/cases/${id}/verify`, { 
        status, 
        rejectionReason: status === 'rejected' ? rejectionReason : "" 
      });
      setSelectedCase(null);
      setRejectionReason("");
      fetchCases();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to verify case");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
       <div className="space-y-4">
         {[...Array(5)].map((_, i) => (
           <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
         ))}
       </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Review Queue</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verification Pending · {cases.length} Cases</p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search applicants..." 
                  className="h-12 pl-12 pr-6 rounded-2xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-64"
               />
            </div>
            <button className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
               <Filter className="w-5 h-5" />
            </button>
         </div>
      </div>

      {cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100 italic text-slate-300">
           <ShieldCheck className="w-16 h-16 mb-4 opacity-10" />
           <p className="text-sm font-black uppercase tracking-widest">Inbox Zero</p>
           <p className="text-xs mt-2">All cases have been processed.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-[40px] border border-slate-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient / Applicant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted On</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c._id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          {c.patientImage ? (
                             <img src={c.patientImage} className="w-full h-full object-cover" alt="" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300 uppercase font-black text-xs">
                                {c.patientName[0]}
                             </div>
                          )}
                       </div>
                       <div>
                          <p className="font-black text-slate-900 leading-none">{c.patientName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{c.createdBy?.name || "Member"}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="h-8 px-4 rounded-lg bg-slate-50 border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest">
                       {c.category}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                     <p className="font-black text-slate-900">₹{c.targetAmount.toLocaleString("en-IN")}</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Medical Cause</p>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/cases/${c._id}`} 
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all"
                      >
                         <Eye className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleVerify(c._id, 'approved')}
                        disabled={submitting}
                        className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                      >
                         <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSelectedCase(c)}
                        disabled={submitting}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                      >
                         <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={(open: boolean) => !open && setSelectedCase(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[32px] bg-white shadow-2xl">
          <div className="p-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                   <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Reject Application</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {selectedCase?._id.slice(-8)}</p>
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Reason for Rejection</label>
                <textarea 
                  className="w-full h-32 p-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-red-500/10 text-sm font-bold text-slate-900 placeholder:text-slate-300 resize-none transition-all outline-none"
                  placeholder="e.g. Hospital documents are unclear or name mismatch found..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 italic px-1">This message will be visible to the patient on their dashboard to help them fix the requirements.</p>
             </div>
          </div>

          <div className="p-8 bg-slate-50/50 flex gap-3">
             <Button 
                variant="ghost" 
                className="flex-grow h-14 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-xs"
                onClick={() => setSelectedCase(null)}
             >
                Cancel
             </Button>
             <Button 
                className="flex-grow h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/10"
                onClick={() => handleVerify(selectedCase._id, 'rejected')}
                disabled={submitting}
              >
                Confirm Rejection
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
