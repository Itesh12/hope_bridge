"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Heart, ShieldCheck, Users, Zap, ArrowUpRight, Plus, HeartPulse, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Home() {
  const { user } = useAuth();
  const [featuredCases, setFeaturedCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/cases');
        // Take top 3 for featured
        setFeaturedCases(res.data.cases.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch featured cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 -z-10 rounded-l-[100px] hidden md:block" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200/20 blur-3xl rounded-full -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                Verified & Secure Platform
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
                Hope for <span className="text-emerald-600 italic">Every</span> Heart.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                We bridge the gap between medical emergencies and human compassion through 
                a rigorously verified, trust-first support system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-emerald-200/50 bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-[1.02]">
                  Explore Active Cases
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl border-slate-200 hover:bg-slate-50">
                  How it Works
                </Button>
              </div>

              {/* Quick Trust Stats */}
              <div className="mt-12 flex items-center gap-8 border-t border-slate-100 pt-8">
                <div>
                  <p className="text-3xl font-bold text-slate-900">2,500+</p>
                  <p className="text-sm text-slate-500 font-medium">Lives Impacted</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-3xl font-bold text-slate-900">₹45Cr+</p>
                  <p className="text-sm text-slate-500 font-medium">Funds Raised</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image / Dynamic Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173599211d0?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-[500px] object-cover"
                  alt="Medical Support"
                />
              </div>
              
              {/* Floating Glass Component */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-2xl max-w-[240px]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Latest Impact</p>
                    <p className="text-sm font-bold text-slate-900">₹25,000 Donated</p>
                  </div>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-emerald-500" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURED CASES --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-xl">
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none px-4 py-1.5 mb-4 text-sm font-bold uppercase tracking-widest">
                Urgent Appeals
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Stories written with hope.</h2>
            </div>
            <Button variant="ghost" className="group text-emerald-700 font-bold text-lg hover:bg-emerald-50">
              View All Stories <ArrowUpRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredCases.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ amount: 0.2 }}
                className="group cursor-pointer h-full"
              >
                <Card className="h-full border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-slate-50/50 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-[32px] overflow-hidden flex flex-col pt-0">
                  <div className="relative h-64 overflow-hidden bg-slate-100 flex-shrink-0">
                    <img 
                      src={item.documents?.[0] || item.image} 
                      className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" 
                      alt={item.headline}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.isUrgent && (
                        <Badge className="bg-red-500 text-white border-none font-bold px-3 py-1 shadow-lg shadow-red-200">
                          Urgent
                        </Badge>
                      )}
                      {item.isVerified && (
                        <Badge className="bg-white/90 backdrop-blur text-emerald-700 border-none font-bold px-3 py-1 flex gap-1.5 items-center shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="p-8 pb-4 flex-shrink-0">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">{item.category}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 leading-tight mb-3">
                      {item.headline}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-slate-500">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">{item.patientName?.[0]}</div>
                       <p className="text-sm font-medium">{item.patientName}, {item.age} yrs</p>
                    </div>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 flex-grow">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Raised</p>
                          <p className="text-xl font-black text-slate-900">₹{(item.raisedAmount || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Goal</p>
                          <p className="text-sm font-bold text-slate-600">₹{(item.targetAmount || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${((item.raisedAmount || 0) / (item.targetAmount || 1)) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-emerald-500 relative"
                        >
                          <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-12" />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-8 pb-10 mt-auto">
                    <Link
                      href={`/cases/${item._id}`}
                      className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white transition-all font-bold text-lg group-hover:shadow-2xl group-hover:shadow-emerald-200 flex items-center justify-center"
                    >
                      Help {item.patientName?.split(' ')[0]} Now
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>


          {/* Patient CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            className="mt-20 rounded-[40px] bg-slate-950 p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-4 block">For Patients & Families</span>
              <h3 className="text-4xl md:text-5xl font-black text-white leading-[1] tracking-tighter mb-4">
                Need help? <span className="text-emerald-500">You are not alone.</span>
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Start your verified medical fundraiser in under 10 minutes. Our team will guide you through every step of the journey.
              </p>
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              {(!user || user.role !== 'donor') && (
                <Link
                  href="/create-case"
                  className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg flex items-center justify-center gap-2 transition-colors shadow-2xl shadow-emerald-900/50"
                >
                  Start Your Case <ArrowUpRight className="w-5 h-5" />
                </Link>
              )}
              <Link
                href="/how-it-works"
                className="h-14 px-10 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                How the process works →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS (REIMAGINED) --- */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-5xl md:text-7xl font-black mb-12 leading-[0.9] tracking-tighter">
                 Trust, built <br /><span className="text-emerald-500">layer by layer.</span>
               </h2>
               <div className="space-y-12">
                 {[
                   { step: "01", title: "Apply with Documents", desc: "Submit medical reports and identity proofs for our compliance team." },
                   { step: "02", title: "Manual Verification", desc: "Our admins verify every detail with the hospital for 100% authenticity." },
                   { step: "03", title: "Launch and Multiply", desc: "Go live on our platform and reach compassionate hearts worldwide." },
                 ].map((item, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.2 }}
                     className="flex gap-8 group"
                   >
                     <div className="text-3xl font-black text-slate-700 group-hover:text-emerald-500 transition-colors">{item.step}</div>
                     <div>
                       <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                       <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>

            <div className="relative">
               <div className="dark-glass p-12 rounded-[60px] relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
                  <Heart className="w-20 h-20 text-emerald-500 mb-8 animate-pulse" />
                  <h3 className="text-4xl font-black mb-6">Transparency is our heartbeat.</h3>
                  <p className="text-slate-400 text-xl leading-relaxed mb-10">
                    We ensure that 100% of your donation reaches the hospitals directly, 
                    monitored by our anti-fraud AI and manual review board.
                  </p>
                  <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-lg">
                    Check Security Policy
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-emerald-600 rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-200">
             <div className="absolute top-0 right-0 p-10 opacity-20"><Plus className="w-32 h-32 rotate-12" /></div>
             <div className="relative z-10">
               <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Become a life-saver today.</h2>
               <p className="text-emerald-50 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                 Join over 50,000 donors who have already made a difference in 2,500+ lives.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-black text-xl">
                    Donate to Urgent Cases
                  </Button>
                  <Button variant="ghost" size="lg" className="h-16 px-12 rounded-2xl text-white hover:bg-white/10 border-2 border-white/20 font-bold text-xl">
                    View Impact Report
                  </Button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer Snapshot */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 font-black text-2xl text-slate-900">
              <HeartPulse className="w-8 h-8 text-emerald-600" />
              <span>HopeBridge</span>
           </div>
           <p className="text-slate-500 text-sm font-medium">© 2026 HopeBridge Verified Medical Platform. Empowering humanity, one heartbeat at a time.</p>
           <div className="flex gap-8 text-sm font-bold text-slate-400">
              <Link href="#" className="hover:text-emerald-600">Privacy</Link>
              <Link href="#" className="hover:text-emerald-600">Terms</Link>
              <Link href="#" className="hover:text-emerald-600">Support</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
