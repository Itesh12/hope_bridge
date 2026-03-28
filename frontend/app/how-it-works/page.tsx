"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Zap,
  Heart,
  ArrowUpRight,
  CheckCircle2,
  HeartPulse,
  Search,
  CreditCard,
  BarChart3,
  Lock,
  Clock,
  Users,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const patientSteps = [
  {
    number: "01",
    icon: FileText,
    title: "Create Your Case",
    desc: "Fill out our guided form with your medical story, diagnosis details, and target amount. Upload your hospital documents and identity proof.",
    tip: "Be honest and detailed. Cases with complete medical records get verified 3x faster.",
    color: "emerald",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Manual Verification",
    desc: "Our dedicated compliance team reviews every document and confirms details directly with the hospital. This step ensures 100% authenticity.",
    tip: "Average verification time is 24–48 hours for complete submissions.",
    color: "blue",
  },
  {
    number: "03",
    icon: Zap,
    title: "Go Live on HopeBridge",
    desc: "Once verified, your case goes live on our platform and is promoted to our global donor network. You receive a verified badge.",
    tip: "Cases with a photo and personal story raise 5x more than plain text cases.",
    color: "purple",
  },
  {
    number: "04",
    icon: Heart,
    title: "Receive Funds Directly",
    desc: "All donations are collected securely and disbursed directly to the hospital or your designated bank account after verification.",
    tip: "Funds are released in tranches to ensure they are used for medical purposes only.",
    color: "rose",
  },
];

const donorSteps = [
  {
    number: "01",
    icon: Search,
    title: "Browse Verified Cases",
    desc: "Explore hundreds of verified medical cases filtered by urgency, category, or location. Every case carries our verification badge.",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Donate Securely",
    desc: "Choose an amount and donate via UPI, card, or net banking. Your transaction is fully encrypted and secured by Razorpay.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Track Your Impact",
    desc: "Get real-time updates on the case you supported. See how funds are used, receive treatment updates, and track the patient's recovery.",
  },
];

const trustPoints = [
  { icon: ShieldCheck, title: "Hospital Confirmation", desc: "We call the treating hospital to verify every case before approval." },
  { icon: Lock, title: "Encrypted Payments", desc: "Razorpay-powered payments with bank-grade 256-bit SSL encryption." },
  { icon: Clock, title: "24–48hr Verification", desc: "Our team operates 7 days a week to ensure fast case processing." },
  { icon: Users, title: "Dedicated Case Manager", desc: "Every patient is assigned a personal case manager for end-to-end support." },
  { icon: BarChart3, title: "Transparent Fund Usage", desc: "Donors receive hospital receipts and treatment updates automatically." },
  { icon: CheckCircle2, title: "Zero Platform Fraud", desc: "Multi-layer AI + human review ensures zero fraudulent cases since launch." },
];

const faqs = [
  {
    q: "How long does verification take?",
    a: "Most cases are verified within 24–48 hours if all documents are submitted correctly. Urgent cases can be fast-tracked to under 12 hours by our emergency response team.",
  },
  {
    q: "What documents are required to create a case?",
    a: "You need a valid government-issued ID, a doctor's prescription or medical report confirming the diagnosis, and a hospital bill or treatment estimate.",
  },
  {
    q: "How are donations disbursed?",
    a: "Funds are released directly to the hospital (preferred) or the patient's bank account after verification. We hold funds in escrow until disbursement is confirmed.",
  },
  {
    q: "Is there a platform fee?",
    a: "HopeBridge charges a minimal 3% platform fee to cover operations. 97% of your donation reaches the patient or hospital directly.",
  },
  {
    q: "Can I donate anonymously?",
    a: "Yes. When donating, simply toggle the 'Donate Anonymously' option. Your name will not be shown on the case page.",
  },
  {
    q: "What happens if the target amount is not reached?",
    a: "Partially funded cases still receive disbursement for all funds collected. We also work with NGO partners to bridge critical funding gaps in urgent situations.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-slate-100 rounded-2xl overflow-hidden bg-white"
      layout
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
      >
        <span className="font-bold text-slate-900 text-lg leading-tight">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-6 text-slate-500 leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* --- HERO --- */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -z-10 rounded-l-[120px] hidden lg:block" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-700 text-sm font-bold mb-8">
              <HeartPulse className="w-4 h-4" />
              Simple. Transparent. Trusted.
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
              How <span className="text-emerald-600 italic">HopeBridge</span> works.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl">
              Whether you're a patient seeking help or a donor looking to create real impact — 
              our process is designed to be simple, safe, and deeply human.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <a href="#for-patients" className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-2 transition-colors">
                I need help <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="#for-donors" className="h-14 px-8 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold flex items-center gap-2 transition-colors">
                I want to donate <Heart className="w-4 h-4 text-emerald-600" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOR PATIENTS --- */}
      <section id="for-patients" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 block">For Patients & Families</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Getting help in 4 steps.
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              From your first application to receiving funds — we walk alongside you every step of the way.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-blue-200 to-rose-200 hidden lg:block" />

            <div className="space-y-16">
              {patientSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ amount: 0.2 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? "lg:grid-flow-dense" : ""}`}
                >
                  {/* Content */}
                  <div className={i % 2 !== 0 ? "lg:col-start-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-${step.color}-100 flex items-center justify-center text-${step.color}-600`}>
                        <step.icon className="w-8 h-8" />
                      </div>
                      <span className="text-6xl font-black text-slate-100">{step.number}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-lg text-slate-500 leading-relaxed mb-6">{step.desc}</p>
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-emerald-800">{step.tip}</p>
                    </div>
                  </div>

                  {/* Visual Step Card */}
                  <div className={`relative flex justify-center ${i % 2 !== 0 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                    <div className="w-full max-w-sm bg-slate-950 rounded-[32px] p-10 text-center shadow-2xl">
                      <div className={`w-20 h-20 rounded-3xl bg-${step.color}-500/10 border border-${step.color}-500/20 flex items-center justify-center text-${step.color}-400 mx-auto mb-6`}>
                        <step.icon className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Step {step.number}</p>
                      <h4 className="text-2xl font-black text-white">{step.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            className="mt-20 text-center"
          >
            <Link href="/create-case" className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg inline-flex items-center gap-2 transition-colors shadow-2xl shadow-emerald-100">
              Start Your Case <ArrowUpRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- FOR DONORS --- */}
      <section id="for-donors" className="py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 block">For Donors</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Making an impact in 3 steps.
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              Find a cause you believe in, donate safely, and watch the difference you make unfold in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Progress connector */}
            <div className="absolute top-16 left-[17%] right-[17%] h-0.5 bg-emerald-100 hidden md:block" />
            {donorSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ amount: 0.2 }}
                className="relative text-center"
              >
                <div className="w-32 h-32 rounded-[32px] bg-white shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-8 relative z-10">
                  <step.icon className="w-12 h-12 text-emerald-600" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            className="mt-20 text-center"
          >
            <Link href="/cases" className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg inline-flex items-center gap-2 transition-all">
              Explore Verified Cases <ArrowUpRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- TRUST & SAFETY --- */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-4 block">Safety & Compliance</span>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-6">
              Your trust is our <span className="text-emerald-500">product.</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Everything we do is built around earning and maintaining the trust of every person on this platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ amount: 0.2 }}
                className="group p-8 rounded-[28px] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/20 transition-all">
                  <point.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{point.title}</h3>
                <p className="text-slate-400 leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 block">FAQ</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Common questions.
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              Can't find your answer? <Link href="/about" className="text-emerald-600 font-bold hover:underline">Contact our team</Link> — we respond within 2 hours.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ amount: 0.1 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <div className="bg-emerald-600 rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-200">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <HeartPulse className="w-16 h-16 text-white/80 mx-auto mb-8" />
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                Ready to begin?
              </h2>
              <p className="text-emerald-50 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Join thousands of patients and donors who are already part of the HopeBridge family.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/create-case" className="h-16 px-12 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-black text-xl inline-flex items-center justify-center gap-2 transition-colors">
                  Apply for Help
                </Link>
                <Link href="/cases" className="h-16 px-12 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 font-bold text-xl inline-flex items-center justify-center gap-2 transition-colors">
                  Donate to a Case
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
