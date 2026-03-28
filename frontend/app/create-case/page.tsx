"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { createCaseSchema, type CreateCaseFormData } from "@/lib/validations/case";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, AlertCircle, ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock, FileText, Heart, IndianRupee, MapPin, ShieldCheck, Stethoscope, UploadCloud, X, Zap, Loader2, User } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Patient", icon: Heart, description: "Basic identity" },
  { id: 2, title: "Medical", icon: Stethoscope, description: "Clinical data" },
  { id: 3, title: "Story", icon: FileText, description: "Personal touch" },
  { id: 4, title: "Verify", icon: ShieldCheck, description: "Documents" },
];

const categories = [
  { id: 'Cancer', label: 'Cancer', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'Accident', label: 'Accident', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'Pediatric', label: 'Pediatric', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'Transplant', label: 'Transplant', icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'Cardiac', label: 'Cardiac', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'Other', label: 'Other', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' },
] as const;

export default function CreateCasePage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
       </div>
    }>
      <CreateCaseContent />
    </Suspense>
  );
}

function CreateCaseContent() {
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [patientFile, setPatientFile] = useState<File | null>(null);
  const [patientPreview, setPatientPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get('id');

  useEffect(() => {
    if (!loading && user && user.role === 'donor') {
      router.push('/cases');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setCanSubmit(false);
    
    if (currentStep === 4) {
      const timer = setTimeout(() => setCanSubmit(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    trigger, 
    reset,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      helpType: ['fund'] as any[],
      isUrgent: false,
    }
  });

  useEffect(() => {
    const fetchExistingCase = async () => {
      if (caseId) {
        setIsEditing(true);
        setInitialLoading(true);
        try {
          const response = await api.get(`/cases/${caseId}`);
          const c = response.data.case;
          reset({
            patientName: c.patientName,
            age: c.age,
            location: c.location,
            disease: c.disease,
            category: c.category,
            hospitalName: c.hospitalName,
            treatmentNeeded: c.treatmentNeeded,
            description: c.description,
            headline: c.headline,
            targetAmount: c.targetAmount,
            helpType: c.helpType,
            isUrgent: c.isUrgent,
            otherHelpDetail: c.otherHelpDetail
          });
          if (c.documents && c.documents.length > 0) {
            setPreviews(c.documents);
          }
          if (c.patientImage) setPatientPreview(c.patientImage);
          if (c.coverImage) setCoverPreview(c.coverImage);
        } catch (err) {
          console.error("Failed to fetch case for editing:", err);
          setErrorMessage("Failed to load case data. Please try again.");
        } finally {
          setInitialLoading(false);
        }
      }
    };
    fetchExistingCase();
  }, [caseId, reset]);

  const selectedCategory = watch('category');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      setErrorMessage("You can only upload up to 5 documents");
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setErrorMessage(null);
  };

  const handlePatientImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPatientFile(file);
      setPatientPreview(URL.createObjectURL(file));
      setValue('patientImage', [file] as any);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setValue('coverImage', [file] as any);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const onSubmit = async (data: any) => {
    if (currentStep < 4 || !canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'helpType') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (data.patientImage && data.patientImage[0]) {
        formData.append('patientImage', data.patientImage[0]);
      }
      if (data.coverImage && data.coverImage[0]) {
        formData.append('coverImage', data.coverImage[0]);
      }

      files.forEach(file => {
        formData.append('documents', file);
      });

      if (isEditing) {
        await api.put(`/cases/${caseId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMessage("Case updated successfully! It will be re-verified by our team.");
      } else {
        await api.post("/cases", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMessage("Case created successfully! Redirecting to dashboard...");
      }

      setTimeout(() => router.push("/profile"), 2000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to create case");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    type CaseKey = keyof CreateCaseFormData;
    let fieldsToValidate: CaseKey[] = [];
    if (currentStep === 1) fieldsToValidate = ['patientName', 'age', 'location'];
    if (currentStep === 2) fieldsToValidate = ['disease', 'category', 'hospitalName', 'treatmentNeeded', 'targetAmount', 'otherHelpDetail', 'helpType'];
    if (currentStep === 3) fieldsToValidate = ['headline', 'description'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-700 text-xs font-black mb-4 uppercase tracking-widest">
               <Zap className="w-3 h-3" /> Step {currentStep} of {steps.length}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-2">
              {isEditing ? "Update Your Case" : "Start a verified case."}
            </h1>
            <p className="text-slate-500 font-medium">{isEditing ? "Modify your case details to improve your fundraising impact." : "Follow our quick 4-step process to get verified help."}</p>
          </div>
          
          <div className="flex items-center gap-2 md:mb-2">
             {steps.map((step, idx) => (
               <div key={idx} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-500 ${currentStep >= step.id ? "bg-emerald-600 w-8" : "bg-slate-200"}`} />
                  {idx < steps.length - 1 && <div className="w-2" />}
               </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="hidden lg:block lg:col-span-4 space-y-4">
             {steps.map((step) => {
               const isActive = currentStep === step.id;
               const isCompleted = currentStep > step.id;
               return (
                 <div 
                   key={step.id}
                   className={`p-6 rounded-3xl border transition-all duration-300 ${
                     isActive 
                     ? "bg-white border-transparent shadow-2xl shadow-emerald-900/5 ring-1 ring-slate-100" 
                     : isCompleted 
                       ? "bg-emerald-50/50 border-emerald-100 opacity-80" 
                       : "bg-transparent border-transparent opacity-40 filter grayscale"
                   }`}
                 >
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive || isCompleted ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400"
                      }`}>
                         {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      <div>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-emerald-600" : "text-slate-400"}`}>Step 0{step.id}</p>
                         <p className="text-sm font-black text-slate-900 leading-none mt-1">{step.title}</p>
                      </div>
                   </div>
                   {isActive && (
                     <motion.p 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: "auto" }}
                       className="text-[11px] text-slate-500 mt-4 leading-relaxed font-medium"
                      >
                        {step.description}: We need this to ensure the case is fully verifiable by our compliance team.
                     </motion.p>
                   )}
                 </div>
               );
             })}
          </div>

          <div className="lg:col-span-8">
            {initialLoading ? (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-xl">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading case data...</p>
               </div>
            ) : (
            <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] bg-white rounded-[40px] overflow-hidden min-h-[500px] flex flex-col">
              <CardContent className="p-8 md:p-12 flex-grow">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Basic Patient Identity</h2>
                          <p className="text-sm text-slate-500 font-medium">Initial data about the person in need of support.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className={cn("space-y-4 pt-4 md:col-span-1")}>
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-1">
                                Patient Portrait <span className="text-emerald-500">*</span>
                             </label>
                             <div 
                                onClick={() => document.getElementById('patient-upload')?.click()}
                                className="relative aspect-square rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all overflow-hidden group"
                             >
                                {patientPreview ? (
                                  <img src={patientPreview} className="w-full h-full object-cover" alt="Patient" />
                                ) : (
                                  <>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-emerald-600 transition-all">
                                      <User className="w-6 h-6" />
                                    </div>
                                    <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Photo</p>
                                  </>
                                )}
                                <input 
                                  id="patient-upload" 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={handlePatientImageChange}
                                />
                             </div>
                          </div>

                          <div className={cn("space-y-4 pt-4 md:col-span-1")}>
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-1">
                                Case Banner / Cover <span className="text-emerald-500">*</span>
                             </label>
                             <div 
                                onClick={() => document.getElementById('cover-upload')?.click()}
                                className="relative aspect-square rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all overflow-hidden group"
                             >
                                {coverPreview ? (
                                  <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                  <>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-emerald-600 transition-all">
                                      <Zap className="w-6 h-6" />
                                    </div>
                                    <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Banner</p>
                                  </>
                                )}
                                <input 
                                  id="cover-upload" 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={handleCoverImageChange}
                                />
                             </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-1">
                            Patient Full Name <span className="text-emerald-500">*</span>
                          </label>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors text-slate-300 group-focus-within:text-emerald-600">
                              <User className="w-5 h-5" />
                            </div>
                            <input
                              {...register('patientName')}
                              placeholder="e.g. John Doe"
                              className="w-full h-14 pl-14 pr-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                            />
                          </div>
                          {errors.patientName && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.patientName.message as string}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="age" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Patient Age</Label>
                            <Input 
                              type="number"
                              {...register('age')}
                              placeholder="8" 
                              className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                            />
                            {errors.age && <p className="text-xs text-red-500 font-bold ml-2">{errors.age.message}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Current Location (City, State)</Label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <Input 
                              {...register('location')}
                              placeholder="Mumbai, Maharashtra" 
                              className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                            />
                          </div>
                          {errors.location && <p className="text-xs text-red-500 font-bold ml-2">{errors.location.message}</p>}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Medical Information</h2>
                          <p className="text-sm text-slate-500 font-medium">Details about the diagnosis and required treatment.</p>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setValue('category', cat.id)}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                                  selectedCategory === cat.id 
                                  ? "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10" 
                                  : "border-slate-50 bg-slate-50 hover:border-emerald-200"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                                  <cat.icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${selectedCategory === cat.id ? 'text-emerald-700' : 'text-slate-500'}`}>
                                  {cat.label}
                                </span>
                              </button>
                            ))}
                          </div>
                          {errors.category && <p className="text-xs text-red-500 font-bold ml-2">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="disease" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Medical Condition / Disease</Label>
                          <div className="relative">
                             <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                             <Input 
                                {...register('disease')}
                                placeholder="e.g. Congenital Heart Disease" 
                                className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                             />
                          </div>
                          {errors.disease && <p className="text-xs text-red-500 font-bold ml-2">{errors.disease.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="hospital" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Hospital Name</Label>
                            <Input 
                              {...register('hospitalName')}
                              placeholder="AIIMS, New Delhi" 
                              className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                            />
                            {errors.hospitalName && <p className="text-xs text-red-500 font-bold ml-2">{errors.hospitalName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="treatment" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Treatment Needed</Label>
                            <Input 
                              {...register('treatmentNeeded')}
                              placeholder="Open Heart Surgery" 
                              className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                            />
                            {errors.treatmentNeeded && <p className="text-xs text-red-500 font-bold ml-2">{errors.treatmentNeeded.message}</p>}
                          </div>
                        </div>

                        {/* Conditional Target Amount */}
                        <AnimatePresence>
                          {(watch('helpType') || []).includes('fund') && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 py-4">
                                <Label htmlFor="goal" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Target Goal Amount (₹)</Label>
                                <div className="relative">
                                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                  <Input 
                                    type="number"
                                    {...register('targetAmount')}
                                    placeholder="500000" 
                                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-black text-xl text-emerald-600" 
                                  />
                                </div>
                                {errors.targetAmount && <p className="text-xs text-red-500 font-bold ml-2">{errors.targetAmount.message}</p>}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-4">
                          <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Help Type Needed</Label>
                          <div className="flex flex-wrap gap-3">
                            {['fund', 'blood', 'marrow', 'other'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  const current = watch('helpType') || [];
                                  if (current.includes(type as any)) {
                                    setValue('helpType', current.filter(t => t !== type) as any, { shouldValidate: true });
                                  } else {
                                    setValue('helpType', [...current, type] as any, { shouldValidate: true });
                                  }
                                }}
                                className={`px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                  (watch('helpType') || []).includes(type as any)
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                }`}
                              >
                                {type === 'other' ? (
                                   <div className="flex items-center gap-2">
                                      <Zap className="w-3.5 h-3.5" />
                                      {type}
                                   </div>
                                ) : type}
                              </button>
                            ))}
                          </div>
                          {errors.helpType && <p className="text-xs text-red-500 font-bold ml-2">{errors.helpType.message}</p>}
                        </div>

                        {/* Conditional Other Detail */}
                        <AnimatePresence>
                          {(watch('helpType') || []).includes('other') && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 py-4">
                                <Label htmlFor="otherHelpDetail" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Other Assistance Requirements</Label>
                                <Input 
                                  {...register('otherHelpDetail')}
                                  placeholder="e.g. Specific medications, life support, or rare blood groups" 
                                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                                />
                                {errors.otherHelpDetail && <p className="text-xs text-red-500 font-bold ml-2">{errors.otherHelpDetail.message}</p>}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Tell Your Story</h2>
                          <p className="text-sm text-slate-500 font-medium">Emotional and clear details help donors understand your need.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="headline" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Catchy Case Headline</Label>
                          <Input 
                            {...register('headline')}
                            placeholder="Support Baby Rahul's Urgent Heart Surgery" 
                            className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-black text-slate-900" 
                          />
                          {errors.headline && <p className="text-xs text-red-500 font-bold ml-2">{errors.headline.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="story" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">The Detailed Journey</Label>
                          <Textarea 
                            {...register('description')}
                            placeholder="Share the story here. What happened exactly? Why do you need these funds urgently? Be as clear and heartfelt as possible." 
                            className="min-h-[200px] rounded-[32px] bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-medium p-8 text-slate-700 leading-relaxed"
                          />
                          {errors.description && <p className="text-xs text-red-500 font-bold ml-2">{errors.description.message}</p>}
                          <div className="flex items-center gap-2 mt-2 ml-1 text-slate-400 italic text-[11px]">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Cases with comprehensive stories are 5x more likely to reach their target.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Verification Documents</h2>
                          <p className="text-sm text-slate-500 font-medium">Transparency is our core value. Please upload authentic records.</p>
                        </div>

                        {successMessage && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                               <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="font-black text-emerald-900">Success!</p>
                               <p className="text-emerald-700 text-sm font-medium">{successMessage}</p>
                            </div>
                          </motion.div>
                        )}

                        {errorMessage && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                               <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="font-black text-red-900">Error</p>
                               <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                            </div>
                          </motion.div>
                        )}
                        
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="group border-2 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-emerald-50/50 text-center hover:border-emerald-200 transition-all duration-500 cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                             <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-emerald-600" />
                          </div>
                          <p className="font-black text-slate-900 text-lg leading-tight">Medical Reports & Estimates</p>
                          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-2">{files.length} of 5 documents uploaded</p>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            multiple 
                            className="hidden" 
                            accept="image/*,.pdf"
                          />
                        </div>

                        {previews.length > 0 && (
                          <div className="grid grid-cols-5 gap-4">
                            {previews.map((preview, index) => (
                              <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-50 bg-white">
                                <img src={preview} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-start gap-4 p-8 bg-slate-900 text-white rounded-[40px] overflow-hidden relative group">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                             <p className="font-black text-lg mb-1 tracking-tight">Manual Verification Process</p>
                             <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                Your case will be manually reviewed by our medical compliance team. We usually approve cases within <span className="text-emerald-400 font-black italic tracking-tight">24–48 hours</span>.
                             </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={`flex items-center mt-auto pt-12 ${currentStep > 1 ? "justify-between" : "justify-end"}`}>
                    {currentStep > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        onClick={prevStep} 
                        disabled={isSubmitting}
                        className="rounded-2xl px-6 h-12 font-black text-slate-500 hover:text-slate-900 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center hover:bg-slate-50"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous Step
                      </Button>
                    )}
                    
                    {currentStep < steps.length ? (
                      <Button 
                        type="button"
                        onClick={nextStep} 
                        className="rounded-full px-16 h-16 bg-[#0f172a] hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_0_6px_rgba(16,185,129,0.1),0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_8px_rgba(16,185,129,0.15),0_25px_50px_-12px_rgba(0,0,0,0.4)]"
                      >
                        Next <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        className="rounded-full px-20 h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_0_6px_rgba(16,185,129,0.1),0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_0_8px_rgba(16,185,129,0.15),0_25px_50px_-12px_rgba(16,185,129,0.4)] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                             Processing...
                          </div>
                        ) : (
                          isEditing ? "Update Case" : "Launch Case"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
             </Card>
            )}

            <div className="mt-8 text-center px-10">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-loose">
                  Trust & Safety: By submitting this case, you certify that all information provided is accurate and truthful. 
                  HopeBridge reserves the right to reject cases that do not meet our verification standards.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
