"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  HeartPulse, 
  ArrowLeft, 
  UserCircle2, 
  UserPlus2, 
  Mail, 
  Lock, 
  User,
  ShieldCheck,
  CheckCircle2,
  Camera, 
  Loader2, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register: registerUser } = useAuth(); // Renamed to avoid collision with hook-form's register

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "donor",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      console.log('--- FRONTEND SIGNUP DIAGNOSTIC ---');
      
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      
      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }
      
      const resData = await registerUser(formData);
      
      console.log('Signup Success Response:', resData);

      // AuthContext handles token and user state
      router.push("/cases");
    } catch (err: any) {
      console.error('XX Signup Error Captured:', err.response?.data?.message);

      if (err.response?.status === 400 && err.response.data.errors) {
        err.response.data.errors.forEach((e: any) => {
          setError(e.field as any, { message: e.message });
        });
      } else {
        setServerError(err.response?.data?.message || "An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (val: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      fieldChange(e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
               <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">HopeBridge</span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-tight">
            Join the movement of <br /><span className="text-emerald-600 italic">hope</span>.
          </h1>
          <p className="text-slate-500 font-medium">Create an account to start saving lives or find the support you need.</p>
        </div>

        <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] bg-white rounded-[40px] overflow-hidden font-bold">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left Side: Role Selection & Profile Image */}
                <div className="md:col-span-12 p-10 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col items-center mb-10">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Your Profile Photo</p>
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[32px] bg-white shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white transition-all group-hover:scale-[1.02]">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-slate-300">
                            <UserCircle2 className="w-12 h-12 mb-1" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Choose Photo</span>
                          </div>
                        )}
                      </div>
                      <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => handleImageChange(e, field.onChange)}
                            />
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-2xl shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 ring-4 ring-white">
                              <Camera className="w-5 h-5" />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">I am joining as a...</p>
                  
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          onClick={() => field.onChange("donor")}
                          className={`relative p-6 rounded-3xl border-2 transition-all text-left group ${
                            field.value === "donor" 
                            ? "border-emerald-600 bg-white shadow-xl shadow-emerald-900/5 ring-4 ring-emerald-50" 
                            : "border-transparent bg-white/50 hover:bg-white hover:border-slate-200"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                              field.value === "donor" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                          }`}>
                            <UserPlus2 className="w-6 h-6" />
                          </div>
                          <p className={`font-black text-lg ${field.value === "donor" ? "text-slate-900" : "text-slate-400"}`}>Donor</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">I want to help and track my impact.</p>
                          {field.value === "donor" && (
                            <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-emerald-600" />
                          )}
                        </button>

                        <button 
                          type="button"
                          onClick={() => field.onChange("patient")}
                          className={`relative p-6 rounded-3xl border-2 transition-all text-left group ${
                            field.value === "patient" 
                            ? "border-emerald-600 bg-white shadow-xl shadow-emerald-900/5 ring-4 ring-emerald-50" 
                            : "border-transparent bg-white/50 hover:bg-white hover:border-slate-200"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                              field.value === "patient" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                          }`}>
                            <UserCircle2 className="w-6 h-6" />
                          </div>
                          <p className={`font-black text-lg ${field.value === "patient" ? "text-slate-900" : "text-slate-400"}`}>Patient</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">I need support for a medical case.</p>
                          {field.value === "patient" && (
                            <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-emerald-600" />
                          )}
                        </button>
                      </div>
                    )}
                  />
                  {errors.role && (
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-4 text-center">{errors.role.message}</p>
                  )}
                </div>

                {/* Right Side: Form */}
                <div className="md:col-span-12 p-10 pt-8">
                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {serverError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? "text-red-400" : "text-slate-300"}`} />
                        <Input 
                          {...register("name")}
                          id="name" 
                          placeholder="John Doe" 
                          className={`h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 transition-all font-medium ${
                            errors.name ? "focus:ring-red-500 ring-2 ring-red-100" : "focus:ring-emerald-500"
                          }`} 
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? "text-red-400" : "text-slate-300"}`} />
                        <Input 
                          {...register("email")}
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          className={`h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 transition-all font-medium ${
                            errors.email ? "focus:ring-red-500 ring-2 ring-red-100" : "focus:ring-emerald-500"
                          }`} 
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</Label>
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
                    {errors.password ? (
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{errors.password.message}</p>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 ml-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Min 8 chars, one uppercase, one number.
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] mb-6 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      "Join HopeBridge"
                    )}
                  </Button>

                  <p className="text-[11px] text-center text-slate-400 font-medium leading-relaxed px-10">
                    By joining, you agree to HopeBridge's <span className="text-slate-900 font-bold">Terms of Service</span> and acknowledge our <span className="text-slate-900 font-bold">Privacy Policy</span>. 
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
          <div className="p-8 bg-slate-50 border-t border-slate-100/50 text-center">
             <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 font-black hover:underline underline-offset-4">
                   Login here
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
