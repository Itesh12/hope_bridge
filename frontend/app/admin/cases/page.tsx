"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  RotateCcw, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageInventory() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/cases?status=${filter}`);
      setCases(res.data.cases);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [filter]);

  const handleRevert = async (id: string) => {
    if (!window.confirm("Move this case back to Pending status? it will appear in your Review Queue again.")) return;
    try {
      await api.patch(`/admin/cases/${id}/verify`, { status: "pending" });
      alert("Case reverted successfully");
      fetchCases();
    } catch (error) {
      alert("Failed to revert case");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This delete is permanent and cannot be undone.")) return;
    try {
      await api.delete(`/admin/cases/${id}`);
      alert("Case deleted successfully");
      fetchCases();
    } catch (error) {
      alert("Failed to delete case");
    }
  };

  const filteredCases = cases.filter(c => 
    c.headline.toLowerCase().includes(search.toLowerCase()) ||
    c.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Master Inventory</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Full platform records · {cases.length} Total Appeals</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-12 pr-6 rounded-2xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-64"
              />
           </div>

           <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {['all', 'pending', 'approved', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === s ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Accessing platform vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:border-emerald-100"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                      <img src={c.documents?.[0]} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors" />
                   </div>
                   
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-md">
                           {c.category}
                         </span>
                         <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <MapPin className="w-3 h-3" /> {c.location}
                         </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors uppercase decoration-emerald-500/30 group-hover:underline underline-offset-4">{c.headline}</h3>
                      <div className="flex items-center gap-4 text-slate-400">
                         <p className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> ₹{c.targetAmount.toLocaleString()}
                         </p>
                         <div className="w-1 h-1 bg-slate-200 rounded-full" />
                         <p className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                   <div className="flex items-center gap-3 px-6 h-12 bg-slate-50/80 rounded-2xl border border-slate-100">
                      {getStatusIcon(c.verificationStatus)}
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{c.verificationStatus}</span>
                   </div>

                   <div className="flex items-center gap-3">
                      <Link 
                        href={`/cases/${c._id}`}
                        className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-all shadow-sm group/btn"
                      >
                        <Eye className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                      </Link>

                      {c.verificationStatus !== 'pending' && (
                        <button 
                          onClick={() => handleRevert(c._id)}
                          className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 flex items-center justify-center transition-all shadow-sm group/btn"
                          title="Revert to Pending"
                        >
                          <RotateCcw className="w-5 h-5 transition-transform group-hover/btn:-rotate-45" />
                        </button>
                      )}

                      <button 
                         onClick={() => handleDelete(c._id)}
                         className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center justify-center transition-all shadow-sm group/btn"
                         title="Delete Case"
                      >
                        <Trash2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                      </button>
                      
                      <ChevronRight className="w-5 h-5 text-slate-200 ml-2 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCases.length === 0 && (
            <div className="py-32 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto opacity-50">
                  <FileText className="w-10 h-10 text-slate-300" />
               </div>
               <div className="space-y-2">
                 <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">No cases found</h4>
                 <p className="text-slate-400 text-sm font-medium">Try adjusting your filters or search terms.</p>
               </div>
               <Button 
                variant="outline" 
                onClick={() => {setFilter('all'); setSearch('');}}
                className="rounded-2xl border-slate-200"
               >
                 Show All Records
               </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
