"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, ArrowLeft, Lock as LockIcon, Mail, Globe, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await login(data);
      router.push("/cases");
    } catch (err: any) {
      if (err.response?.status === 400 && err.response.data.errors) {
        err.response.data.errors.forEach((e: any) => {
          setError(e.field as any, { message: e.message });
        });
      } else {
        setServerError(err.response?.data?.message || "Invalid email or password. Please try again.");
      }
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
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
               <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">HopeBridge</span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-tight">
            Welcome back to <br />the community.
          </h1>
          <p className="text-slate-500 font-medium">Log in to your account and continue your journey of impact.</p>
        </div>

        <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] bg-white rounded-[40px] overflow-hidden">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? "text-red-400" : "text-slate-300"}`} />
                  <Input 
                    {...register("email")}
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className={`h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 transition-all font-medium ${
                      errors.email ? "focus:ring-red-500 ring-2 ring-red-100" : "focus:ring-emerald-500"
                    }`} 
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                <div className="relative">
                  <LockIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? "text-red-400" : "text-slate-300"}`} />
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
                <div className="flex justify-end pr-1">
                   <Link href="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                      Forgot Password?
                   </Link>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="h-14 rounded-2xl border-slate-100 bg-white hover:bg-slate-50 font-bold flex gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-14 rounded-2xl border-slate-100 bg-white hover:bg-slate-50 font-bold flex gap-2">
                  <Globe className="w-5 h-5" />
                  Website
                </Button>
              </div>
            </form>
          </CardContent>
          <div className="p-8 bg-slate-50 border-t border-slate-100/50 text-center">
             <p className="text-sm text-slate-500 font-medium">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-emerald-600 font-black hover:underline underline-offset-4">
                   Sign up for free
                </Link>
             </p>
          </div>
        </Card>

        <div className="mt-12 text-center">
           <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
