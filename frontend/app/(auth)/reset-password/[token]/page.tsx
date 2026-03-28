"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, use } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const resetSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[0-9]/, "One number required"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await api.put(`/auth/resetpassword/${token}`, {
        password: data.password,
      });

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Invalid or expired token. Please request a new link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
               <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">HopeBridge</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-tight">
            Create new <br />password.
          </h1>
          <p className="text-slate-500 font-medium font-bold">Your security is our priority. Please choose a strong password.</p>
        </div>

        <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] bg-white rounded-[40px] overflow-hidden">
          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Password Reset!</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your password has been successfully updated. Redirecting you to login...
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit(onSubmit)} 
                  className="space-y-6"
                >
                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {serverError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="password" title="New Password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">New Password</Label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? "text-red-400" : "text-slate-300"}`} />
                      <Input 
                        {...register("password")}
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className={`h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 transition-all font-medium ${
                          errors.password ? "focus:ring-red-500 ring-2 ring-red-100" : "focus:ring-emerald-500"
                        }`} 
                      />
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" title="Confirm Password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</Label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? "text-red-400" : "text-slate-300"}`} />
                      <Input 
                        {...register("confirmPassword")}
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        className={`h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 transition-all font-medium ${
                          errors.confirmPassword ? "focus:ring-red-500 ring-2 ring-red-100" : "focus:ring-emerald-500"
                        }`} 
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
           <Link href="/login" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
