"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  User as UserIcon,
  Search,
  MoreVertical,
  Activity,
  Trash2,
  Lock,
  Unlock,
  Eye,
  X,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      alert(`User ${newStatus === 'banned' ? 'banned' : 'activated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure? This will delete the user and all their cases permanently.")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const fetchUserActivity = async (userId: string) => {
    setLoadingActivity(true);
    try {
      const res = await api.get(`/admin/users/${userId}/activity`);
      setUserActivity(res.data.cases);
      setShowActivityModal(true);
    } catch (error) {
      alert("Failed to load user activity");
    } finally {
      setLoadingActivity(false);
    }
  };

  if (loading) {
    return (
       <div className="space-y-4">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
         ))}
       </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[9px] font-black">Super Admin</Badge>;
      case 'patient':
        return <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[9px] font-black">Help Seeker</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 rounded-lg uppercase tracking-widest text-[9px] font-black">Supporter</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'banned') {
      return <Badge className="bg-red-50 text-red-600 border-none px-2 py-0.5 rounded-md uppercase tracking-widest text-[8px] font-black flex items-center gap-1"><Lock className="w-2 h-2" /> Banned</Badge>;
    }
    return <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-md uppercase tracking-widest text-[8px] font-black flex items-center gap-1"><Unlock className="w-2 h-2" /> Active</Badge>;
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Users</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Administrative Registry · {users.length} Total Accounts</p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search accounts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-12 pr-6 rounded-2xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-72"
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.filter(u => 
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((u) => (
          <div key={u._id} className={`bg-white rounded-[40px] border ${u.status === 'banned' ? 'border-red-100 bg-red-50/10' : 'border-slate-100'} p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] hover:shadow-emerald-900/5 transition-all group relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4 relative z-10 font-bold">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 border border-slate-100 p-1 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <div className="w-full h-full rounded-[18px] bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-inner">
                      {u.name[0]}
                    </div>
                    {u.role === 'admin' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                        <Shield className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase">{u.name}</h4>
                      {getStatusBadge(u.status)}
                    </div>
                    {getRoleBadge(u.role)}
                  </div>
               </div>
            </div>

            <div className="space-y-6 relative z-10 font-black">
               <div className="flex flex-col gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  <div className="flex items-center gap-2">
                     <Mail className="w-3.5 h-3.5 text-slate-400" />
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Calendar className="w-3.5 h-3.5 text-slate-400" />
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Member Since {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>

               {u.role !== 'admin' && (
                 <div className="grid grid-cols-2 gap-3">
                   <Button 
                    variant="outline" 
                    className="h-12 rounded-2xl border-slate-200 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                    onClick={() => {
                      setSelectedUser(u);
                      fetchUserActivity(u._id);
                    }}
                   >
                     <Activity className="w-4 h-4 text-emerald-600" />
                     History
                   </Button>
                   <Button 
                    variant={u.status === 'banned' ? "default" : "outline"}
                    className={`h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${u.status === 'banned' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-none' : 'text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700'}`}
                    onClick={() => handleUpdateStatus(u._id, u.status)}
                   >
                     {u.status === 'banned' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                     {u.status === 'banned' ? 'Unban' : 'Ban'}
                   </Button>
                   <Button 
                    variant="ghost" 
                    className="h-12 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 col-span-2"
                    onClick={() => handleDeleteUser(u._id)}
                   >
                     <Trash2 className="w-4 h-4" />
                     Delete Account
                   </Button>
                 </div>
               )}
            </div>
            
            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700 -z-0" />
          </div>
        ))}
      </div>

      {/* --- Activity Modal --- */}
      <AnimatePresence>
        {showActivityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActivityModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active History</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{selectedUser?.name}'s Platform Activity</p>
                </div>
                <button 
                  onClick={() => setShowActivityModal(false)}
                  className="w-12 h-12 rounded-2xl hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-4">
                {userActivity.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <PlusCircle className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No cases created yet</p>
                  </div>
                ) : (
                  userActivity.map((c) => (
                    <Link 
                      key={c._id} 
                      href={`/cases/${c._id}`}
                      className="group p-6 rounded-3xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-6 block"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                          <img src={c.documents?.[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors uppercase">{c.headline}</h4>
                          <div className="flex items-center gap-3 mt-1 underline-offset-4 decoration-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.category}</p>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">₹{c.targetAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {c.verificationStatus === 'approved' && <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5"><CheckCircle className="w-2 h-2 mr-1" /> Verified</Badge>}
                        {c.verificationStatus === 'pending' && <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5"><Clock className="w-2 h-2 mr-1" /> Pending</Badge>}
                        {c.verificationStatus === 'rejected' && <Badge className="bg-red-50 text-red-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5"><AlertCircle className="w-2 h-2 mr-1" /> Rejected</Badge>}
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 block">{new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <Button 
                  className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest"
                  onClick={() => setShowActivityModal(false)}
                >
                  Close Record
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
