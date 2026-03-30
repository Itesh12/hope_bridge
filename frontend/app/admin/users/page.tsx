"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  User as UserIcon,
  Heart,
  TrendingUp,
  Search,
  MoreVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
       <div className="space-y-4">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
         ))}
       </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[9px] font-black underline-offset-4">Super Admin</Badge>;
      case 'patient':
        return <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[9px] font-black">Help Seeker</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[9px] font-black">Supporter</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Community Registry · {users.length} Members</p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search by name/email..." 
                  className="h-12 pl-12 pr-6 rounded-2xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-72"
               />
            </div>
            <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10">
               <Shield className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u._id} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] hover:shadow-emerald-900/5 transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div className="w-16 h-16 rounded-[24px] bg-slate-50 border border-slate-100 p-1 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                  <div className="w-full h-full rounded-[18px] bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-inner">
                     {u.name[0]}
                  </div>
                  {u.role === 'admin' && (
                     <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                        <Shield className="w-3 h-3 text-white fill-white" />
                     </div>
                  )}
               </div>
               <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-slate-900 flex items-center justify-center transition-colors">
                  <MoreVertical className="w-5 h-5" />
               </button>
            </div>

            <div className="space-y-6 relative z-10">
               <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase underline-offset-4 decoration-emerald-500/30 group-hover:underline">{u.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                     <Mail className="w-3 h-3 text-slate-300" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between py-5 border-y border-slate-50">
                  {getRoleBadge(u.role)}
                  <div className="flex items-center gap-2 text-slate-300">
                     <Calendar className="w-3.5 h-3.5" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex-grow flex flex-col gap-1">
                     <div className="flex items-center gap-1.5 text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Member Rank</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-3/4 opacity-40" />
                     </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors">
                     <Heart className="w-4 h-4 fill-white" />
                  </div>
               </div>
            </div>
            
            {/* Visual background element */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700 -z-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
