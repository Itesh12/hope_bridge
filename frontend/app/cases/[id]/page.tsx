"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Heart, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Share2, 
  ShieldCheck, 
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Zap,
  User,
  Activity,
  Droplets,
  HeartPulse,
  Lock as LockIcon,
  X,
  Maximize2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface ICaseUpdate {
  date: string;
  title: string;
  content: string;
}

interface ICaseDetail {
  id: string;
  headline: string;
  patientName: string;
  age: number;
  location: string;
  disease: string;
  treatmentNeeded: string;
  raisedAmount: number;
  targetAmount: number;
  category: string;
  isUrgent: boolean;
  isVerified: boolean;
  helpType: string[];
  image: string;
  daysLeft: number;
  description: string;
  hospitalName: string;
  donorsCount: number;
  updates: ICaseUpdate[];
  patientImage?: string;
  coverImage?: string;
  documents: string[];
}

// --- Mock Data Finder (Matches Cases Listing) ---
const ALL_CASES: ICaseDetail[] = [
  {
    id: "1",
    headline: "Support Rahul's Urgent Heart Surgery",
    patientName: "Rahul Sharma",
    age: 8,
    location: "AIIMS, New Delhi",
    disease: "Congenital Heart Disease",
    treatmentNeeded: "Open-heart surgery",
    raisedAmount: 450000,
    targetAmount: 600000,
    category: "Surgery",
    isUrgent: true,
    isVerified: true,
    helpType: ["fund"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200",
    daysLeft: 5,
    description: "Rahul is a bright 8-year-old suffering from a complex heart defect. He requires urgent open-heart surgery to survive. His father is a daily wage laborer and cannot afford the astronomical hospital costs. AIIMS has fast-tracked his case, but we need the funds by next week.",
    hospitalName: "AIIMS (All India Institute of Medical Sciences)",
    donorsCount: 124,
    documents: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200"],
    updates: [
      { date: "Oct 24, 2023", title: "Hospital Admission", content: "Rahul has been admitted to the pediatric cardiac ward." },
      { date: "Oct 20, 2023", title: "Campaign Launched", content: "We started the fundraising campaign today." }
    ]
  },
  // Adding more cases can be done later if needed, but for now we'll handle the dynamic part
];

const helpTypeIcon = (type: string) => {
  if (type === "blood") return <Droplets className="w-4 h-4 text-rose-500" />;
  if (type === "marrow") return <Activity className="w-4 h-4 text-blue-500" />;
  return <Heart className="w-4 h-4 text-emerald-500" />;
};

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const [data, setData] = useState<ICaseDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/cases/${caseId}`);
        const c = res.data.case;
        // Transform API data to ICaseDetail interface
        setData({
          id: c._id,
          headline: c.headline,
          patientName: c.patientName,
          age: c.age,
          location: c.location,
          disease: c.disease,
          treatmentNeeded: c.treatmentNeeded,
          raisedAmount: c.raisedAmount || 0,
          targetAmount: c.targetAmount || 0,
          category: c.category,
          isUrgent: c.isUrgent,
          isVerified: c.isVerified,
          helpType: c.helpType,
          image: c.documents?.[0] || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200",
          daysLeft: 15,
          description: c.description,
          hospitalName: c.hospitalName,
          donorsCount: 0,
          updates: [],
          patientImage: c.patientImage,
          coverImage: c.coverImage,
          documents: c.documents || []
        });
      } catch (err: any) {
        console.error("Failed to fetch case:", err);
        setError(err.response?.data?.message || "Case not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
       <Activity className="w-12 h-12 text-emerald-600 animate-pulse mb-4" />
       <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Retrieving secure medical records...</p>
    </div>
  );
  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-10">
       <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
       <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Case Not Found</h1>
       <p className="text-slate-500 font-medium max-w-md mb-8 leading-relaxed font-bold">The case you are looking for might have been removed or is temporarily unavailable.</p>
       <Link href="/cases" className="px-8 h-12 bg-[#0f172a] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
          Browse All Cases <ArrowRight className="w-4 h-4" />
       </Link>
    </div>
  );

  const pct = Math.round((data.raisedAmount / data.targetAmount) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ── DOCUMENT VIEWER DIALOG ── */}
      <Dialog open={!!selectedDoc} onOpenChange={(open: boolean) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 overflow-hidden border-none bg-black/95 backdrop-blur-2xl rounded-[40px]">
          <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
             <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all"
                onClick={() => window.open(selectedDoc!, '_blank')}
             >
                <Maximize2 className="w-5 h-5" />
             </Button>
             <DialogClose 
               render={
                 <Button 
                   variant="outline" 
                   size="icon" 
                   className="w-12 h-12 rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all" 
                 />
               }
             >
                <X className="w-5 h-5" />
             </DialogClose>
          </div>
          
          <div className="w-full h-full flex flex-col pt-20 pb-10 px-10">
             <div className="flex-grow rounded-[32px] overflow-hidden bg-white shadow-2xl relative">
                {selectedDoc?.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={selectedDoc} className="w-full h-full border-none" />
                ) : (
                  <img src={selectedDoc || ''} className="w-full h-full object-contain" alt="Document Preview" />
                )}
             </div>
             <div className="mt-8 flex justify-between items-center px-4">
                <div>
                   <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">Verified Medical Document</h3>
                   <p className="text-white/40 text-xs font-black uppercase tracking-widest">Case ID: {caseId?.slice(-8)} · Secure Hospital Attachment</p>
                </div>
                <Button 
                   className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all"
                   onClick={() => window.open(selectedDoc!, '_blank')}
                >
                   View Full Screen
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* ── TOP NAVIGATION ── */}
      <div className="fixed top-20 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40 transition-all">
         <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/cases" className="text-sm font-black text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
               <ChevronLeft className="w-4 h-4" /> All Cases
            </Link>
            <div className="flex items-center gap-4">
               <button className="h-10 px-4 rounded-xl text-slate-400 hover:text-slate-900 flex items-center gap-2 text-sm font-bold border border-transparent hover:border-slate-200 transition-all">
                  <Share2 className="w-4 h-4" /> Share
               </button>
            </div>
         </div>
      </div>

      <div className="pt-44 pb-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Case Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                 {data.isUrgent && (
                   <Badge className="bg-red-500/10 text-red-600 border-none font-black px-3 py-1 text-xs uppercase tracking-widest flex gap-1 items-center">
                     <Clock className="w-3 h-3" /> Urgent: {data.daysLeft}d left
                   </Badge>
                 )}
                 {data.isVerified && (
                   <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-black px-3 py-1 text-xs uppercase tracking-widest flex gap-1 items-center">
                     <ShieldCheck className="w-3 h-3" /> Verified Case
                   </Badge>
                 )}
                 <Badge className="bg-slate-900/10 text-slate-700 border-none font-black px-3 py-1 text-xs uppercase tracking-widest">
                   {data.category}
                 </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                {data.headline}
              </h1>
              
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-lg overflow-hidden border-2 border-white shadow-md">
                       {data.patientImage ? (
                         <img src={data.patientImage} className="w-full h-full object-cover" alt={data.patientName} />
                       ) : (
                         data.patientName[0]
                       )}
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900">{data.patientName}</p>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{data.age} yrs · Patient</p>
                    </div>
                 </div>
                 <div className="h-8 w-px bg-slate-200" />
                 <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold">{data.location}</span>
                 </div>
              </div>
            </div>

            {/* Feature Image */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white"
            >
               <img 
                  src={data.coverImage || data.image} 
                  className="w-full h-full object-cover" 
                  alt={data.headline} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
               <div className="absolute bottom-6 left-6 flex gap-2">
                  {data.helpType.map((t: string) => (
                    <div key={t} className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur rounded-full shadow-lg">
                        {helpTypeIcon(t)}
                        <span className="text-xs font-black uppercase text-slate-900 tracking-wider">Needs {t}</span>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Verification Block */}
            <div className="p-8 rounded-[32px] bg-slate-950 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
               <div className="flex items-start gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black mb-1">Direct verification from {data.hospitalName.split(" ")[0]}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Our compliance team has called the <strong>{data.hospitalName}</strong> and verified {data.patientName}'s medical identification. Funds will be disbursed directly to the hospital’s medical trust account.
                     </p>
                  </div>
               </div>
            </div>

            {/* Story & Description */}
            <div className="space-y-8">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">The Story</h3>
               <div className="prose prose-slate max-w-none">
                  <p className="text-xl text-slate-500 leading-relaxed font-medium mb-6">
                    {data.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                     <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100">
                        <Stethoscope className="w-6 h-6 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-black text-slate-900 mb-2">Medical Diagnosis</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{data.disease}"</p>
                     </div>
                     <div className="p-8 rounded-[32px] bg-slate-100/50 border border-slate-100">
                        <Building2 className="w-6 h-6 text-slate-400 mb-4" />
                        <h4 className="text-lg font-black text-slate-900 mb-2">Treating Hospital</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic">{data.hospitalName}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Documentation Section */}
            <div className="space-y-6">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Medical Verification</h3>
               <div className="grid grid-cols-1 gap-4">
                  {data.documents.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="p-8 rounded-[32px] border-2 border-dashed border-slate-200 bg-white group hover:border-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-900/5"
                    >
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                                <FileText className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="font-black text-slate-900">Verified Medical Document {idx + 1}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Secure Attachment · Ref: {caseId?.slice(-6).toUpperCase()}</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setSelectedDoc(doc)}
                            className="h-10 px-4 rounded-xl text-slate-400 hover:text-emerald-600 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors border border-transparent hover:border-emerald-100"
                          >
                             View Document <ArrowRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Timeline/Updates */}
            {data.updates && data.updates.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Case Updates</h3>
                <div className="relative pl-12 space-y-12 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100">
                    {data.updates.map((update: ICaseUpdate, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[33px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-emerald-600" />
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">{update.date}</p>
                        <h4 className="text-lg font-black text-slate-900 mb-2">{update.title}</h4>
                        <p className="text-sm text-slate-400 font-medium">{update.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>

          {/* ── SIDEBAR (STICKY ON DESKTOP) ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
            <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-white rounded-[40px] overflow-hidden">
               <CardContent className="p-10">
                  <div className="flex justify-between items-end mb-6">
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-1">
                           <TrendingUp className="w-3 h-3" /> Funded
                        </p>
                        <p className="text-4xl font-black text-slate-900">
                           ₹{data.raisedAmount.toLocaleString("en-IN")}
                        </p>
                     </div>
                     <p className="text-lg font-black text-emerald-600">{pct}%</p>
                  </div>

                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                     />
                  </div>

                  <div className="flex justify-between items-center mb-10 text-xs font-bold uppercase tracking-widest text-slate-400">
                     <p>of ₹{data.targetAmount.toLocaleString("en-IN")} target</p>
                     <p>{data.donorsCount} Donors</p>
                  </div>

                  <div className="space-y-4">
                     <button className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        Help {data.patientName.split(" ")[0]} Now <Heart className="w-5 h-5 fill-white" />
                     </button>
                     <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <LockIcon className="w-3 h-3" /> Secure Payment via Razorpay
                     </p>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-50">
                     <h5 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Trust Markers</h5>
                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Zap className="w-4 h-4" />
                           </div>
                           <p className="text-xs text-slate-500 font-bold leading-relaxed">
                              Verified Identity of fundraising creator.
                           </p>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <AlertCircle className="w-4 h-4" />
                           </div>
                           <p className="text-xs text-slate-500 font-bold leading-relaxed">
                              100% money back if fraud is found.
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="mt-8 p-8 rounded-[40px] bg-slate-900 text-white flex items-center justify-between group cursor-pointer hover:bg-emerald-600 transition-all duration-300 shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                     <HeartPulse className="w-5 h-5 text-emerald-500 group-hover:text-white" />
                  </div>
                  <p className="font-bold text-sm">Become a Monthly Donor</p>
               </div>
               <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
