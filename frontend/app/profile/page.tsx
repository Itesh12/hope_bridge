"use client";

import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Heart,
  Award,
  Lock,
  ChevronRight,
  ClipboardList,
  Activity,
  Zap,
  Edit,
  ExternalLink,
  Clock3
} from "lucide-react";
import api from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChangePasswordDialog } from "@/components/auth/ChangePasswordDialog";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  profileImage: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userCases, setUserCases] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user, reset]);

  useEffect(() => {
    const fetchUserCases = async () => {
      if (user && (user.role === 'patient' || user.role === 'admin')) {
        setLoadingCases(true);
        try {
          const response = await api.get('/cases/my');
          setUserCases(response.data.cases);
        } catch (err) {
          console.error("Failed to fetch user cases:", err);
        } finally {
          setLoadingCases(false);
        }
      }
    };
    fetchUserCases();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      // Note: Backend ignores email updates in updateDetails for security, 
      // but we send only what's allowed.
      
      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      await updateUser(formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/30">
        <Card className="max-w-md w-full border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-[40px] bg-white overflow-hidden">
          <CardContent className="pt-16 pb-16 text-center px-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Not Signed In</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed font-bold">Please sign in to your HopeBridge account to manage your profile and view your impact.</p>
            <Link 
              href="/login" 
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-900/10 transition-all flex items-center justify-center font-bold"
              )}
            >
              Sign In to Continue
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile Card & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] bg-white rounded-[40px] overflow-hidden text-center p-10 relative font-bold">
               <div className="absolute top-0 left-0 w-full h-32 bg-emerald-50/50 -z-10" />
              
              <div className="relative inline-block mx-auto mb-6 mt-4">
                <Avatar className="h-32 w-32 rounded-[32px] border-4 border-white shadow-2xl overflow-hidden">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-emerald-600 text-white font-black text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="profile-upload" className="w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all border-2 border-slate-50 active:scale-95 group">
                    <Camera className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <input 
                      id="profile-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{user.name}</h2>
              <p className="text-slate-500 font-medium mb-6 font-bold">{user.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-[10px] uppercase font-black tracking-widest border border-emerald-100 mb-8">
                <Shield className="w-3 h-3" />
                {user.role} Account
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-center gap-10">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">12</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Cases</p>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">$1.2k</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Donated</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-none shadow-[0_40px_100px_-20px_rgba(16,185,129,0.15)] bg-emerald-600 rounded-[40px] p-10 text-white relative overflow-hidden font-bold">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 font-black uppercase text-[10px] tracking-widest opacity-80 bg-white/10 w-fit px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  Impact Milestone
                </div>
                <h3 className="text-3xl font-black mb-3 tracking-tight">Champion Soul</h3>
                <p className="text-sm font-medium opacity-80 mb-10 leading-relaxed font-bold">You are only $800 away from unlocking the next impact badge. Keep bridging the hope!</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <span>Rank: Silver Donor</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2.5 bg-emerald-700/50" />
                </div>
                
                <div className="mt-12 grid grid-cols-2 gap-5">
                  <div className="p-5 bg-white/10 rounded-[30px] backdrop-blur-md border border-white/5">
                    <Heart className="w-6 h-6 mb-3 text-emerald-200" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Impacted</p>
                    <p className="text-xl font-black">4 Lives</p>
                  </div>
                  <div className="p-5 bg-white/10 rounded-[30px] backdrop-blur-md border border-white/5">
                    <Award className="w-6 h-6 mb-3 text-emerald-200" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Badges</p>
                    <p className="text-xl font-black">7 Global</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] bg-white rounded-[40px] overflow-hidden font-bold">
              <CardHeader className="p-12 pb-0">
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Account Settings</CardTitle>
                <CardDescription className="text-slate-500 font-medium mt-2 text-lg font-bold">Manage your profile information and account security.</CardDescription>
              </CardHeader>

              <CardContent className="p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  <AnimatePresence>
                    {successMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 rounded-[24px] bg-emerald-50 border border-emerald-100 flex items-center gap-4 text-emerald-700 font-bold mb-8"
                      >
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                        {successMessage}
                      </motion.div>
                    )}
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 rounded-[24px] bg-red-50 border border-red-100 flex items-center gap-4 text-red-600 font-bold mb-8"
                      >
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        {errorMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                      <div className="relative">
                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? "text-red-400" : "text-slate-300"}`} />
                        <Input 
                          {...register("name")}
                          id="name" 
                          placeholder="Your Display Name" 
                          className={`h-16 pl-14 rounded-[24px] bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all font-medium text-lg ${
                            errors.name ? "focus:ring-red-100 border-red-200" : "focus:ring-emerald-50"
                          }`} 
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address (Identity - Read Only)</Label>
                      <div className="relative opacity-60">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("email")}
                          id="email" 
                          readOnly
                          className="h-16 pl-14 rounded-[24px] bg-slate-100 border-transparent cursor-not-allowed font-medium text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar className="w-5 h-5 opacity-50" />
                      <span className="text-xs font-black uppercase tracking-widest opacity-60">Last updated: Just now</span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="h-16 px-12 rounded-[24px] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl shadow-2xl shadow-emerald-900/20 transition-all active:scale-[0.98] flex items-center gap-3"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                           Save Profile Details <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Sections */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] bg-white rounded-[40px] p-10 hover:bg-slate-50 transition-all cursor-pointer group-hover:-translate-y-2 duration-300 border-2 border-transparent group-hover:border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                  <Lock className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">Change Password</h4>
                <p className="text-slate-500 font-medium leading-relaxed font-bold">Ensure your account stays secure by periodically updating your credentials.</p>
                <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                   Manage Security <ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* My Cases Section - Only for Patients/Admins */}
          {(user?.role === 'patient' || user?.role === 'admin') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 mb-20"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">My Submitted Cases</h3>
                  <p className="text-slate-500 font-medium mt-1">Track and manage your fund raising requests</p>
                </div>
                {userCases.length > 0 && (
                   <Link href="/create-case" className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest hover:text-emerald-500 transition-colors">
                      <TrendingUp className="w-4 h-4" /> Start New Case
                   </Link>
                )}
              </div>

              {loadingCases ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border-2 border-dashed border-slate-100">
                   <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading your cases...</p>
                </div>
              ) : userCases.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border-2 border-dashed border-slate-100 text-center px-10">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <ClipboardList className="w-10 h-10 text-slate-200" />
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 mb-2">No Cases Found</h4>
                   <p className="text-slate-500 font-medium max-w-md mb-8 leading-relaxed font-bold">You haven't submitted any cases yet. Start your first case to raise funds for medical treatments.</p>
                   <Link 
                      href="/create-case" 
                      className="px-8 h-12 bg-[#0f172a] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                   >
                      Create First Case <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {userCases.map((c) => (
                    <motion.div
                      key={c._id}
                      whileHover={{ y: -5 }}
                      className="group bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.1)] border-2 border-transparent hover:border-emerald-50 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 font-bold"
                    >
                      <Link href={`/cases/${c._id}`} className="flex flex-col md:flex-row items-center gap-8 flex-grow">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden relative border-4 border-white shadow-lg">
                          {c.documents && c.documents[0] ? (
                            <img src={c.documents[0]} className="w-full h-full object-cover" alt="Case preview" />
                          ) : (
                            <Activity className="w-10 h-10 text-slate-200" />
                          )}
                          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                              getStatusColor(c.verificationStatus)
                            )}>
                              {c.verificationStatus}
                            </span>
                            {c.isUrgent && (
                              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Urgent
                              </span>
                            )}
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:ml-auto">
                              <Clock3 className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{c.headline}</h4>
                          <p className="text-slate-500 font-medium text-sm truncate max-w-lg mb-0 font-bold tracking-tight">{c.disease} · {c.hospitalName}</p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-3 flex-shrink-0">
                         <Link 
                            href={`/create-case?id=${c._id}`}
                            className="h-12 px-6 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                         >
                            <Edit className="w-4 h-4" /> Update Details
                         </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <ChangePasswordDialog 
        isOpen={isPasswordDialogOpen} 
        onClose={() => setIsPasswordDialogOpen(false)} 
      />
    </div>
  );
}
