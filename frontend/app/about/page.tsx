"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  Heart,
  Users,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  HeartPulse,
  Globe,
  Lock,
  Star,
} from "lucide-react";

const stats = [
  { label: "Lives Impacted", value: "2,500+", icon: Heart },
  { label: "Funds Raised", value: "₹45Cr+", icon: Zap },
  { label: "Verified Cases", value: "1,200+", icon: ShieldCheck },
  { label: "Donors Worldwide", value: "50,000+", icon: Globe },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust First",
    desc: "Every case is manually reviewed and verified by our compliance team before going live. We never compromise on authenticity.",
  },
  {
    icon: Heart,
    title: "Human First",
    desc: "Behind every number is a real person with a real story. We exist to ensure those stories are heard and acted upon.",
  },
  {
    icon: Lock,
    title: "Zero Fraud Tolerance",
    desc: "Our multi-layer verification — including hospital confirmation and document checks — makes HopeBridge a fraud-free zone.",
  },
  {
    icon: Zap,
    title: "Fast Emergency Response",
    desc: "Critical cases are fast-tracked through our expedited review process so help can reach families within hours.",
  },
  {
    icon: Globe,
    title: "Global Impact, Local Heart",
    desc: "Our donor network spans 40+ countries, yet every campaign is rooted in the deeply personal reality of one family's crisis.",
  },
  {
    icon: Star,
    title: "Radical Transparency",
    desc: "Donors can track exactly how their contribution is used — down to the hospital receipt. No black boxes, ever.",
  },
];

const team = [
  {
    name: "Priya Nair",
    role: "Co-Founder & CEO",
    bio: "Former healthcare policy advisor with 12 years of experience bridging institutional funding and patient care.",
    initials: "PN",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Arjun Mehta",
    role: "Co-Founder & CTO",
    bio: "Full-stack engineer and fintech veteran. Previously built fraud-detection systems for a major Indian payment gateway.",
    initials: "AM",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Dr. Kavitha Rao",
    role: "Head of Medical Verification",
    bio: "Practicing oncologist and hospital administrator with deep expertise in medical documentation and compliance.",
    initials: "KR",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Rohan Sharma",
    role: "Head of Operations",
    bio: "Former NGO director who has coordinated emergency medical funding across rural India for over a decade.",
    initials: "RS",
    color: "bg-amber-100 text-amber-700",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* --- HERO --- */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-emerald-50/40 -z-10 rounded-r-[100px] hidden md:block" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100/20 blur-3xl rounded-full -z-10" />

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-700 text-sm font-bold mb-8">
              <HeartPulse className="w-4 h-4" />
              Our Mission
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
              Built to give every{" "}
              <span className="text-emerald-600 italic">crisis</span>
              {" "}a fighting chance.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl">
              HopeBridge was founded on one belief: no family should lose a loved one 
              simply because they couldn't afford the care. We are the bridge between 
              those in need and those who can help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ amount: 0.3 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-slate-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OUR STORY --- */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ amount: 0.2 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 block">Our Story</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-[1]">
                It started with one phone call.
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  In 2022, our co-founder Priya received a call from her cousin — a young 
                  father whose three-year-old daughter needed emergency open-heart surgery. 
                  The surgery cost ₹6 lakh. The family had ₹40,000.
                </p>
                <p>
                  Priya reached out on social media, but with no verification, trust was 
                  low. Donations trickled in. They were weeks too late.
                </p>
                <p>
                  That call never left her. HopeBridge was built to ensure no family 
                  ever has to fight that battle alone — or in silence.
                </p>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xl">
                  PN
                </div>
                <div>
                  <p className="font-bold text-slate-900">Priya Nair</p>
                  <p className="text-sm text-slate-500">Co-Founder & CEO, HopeBridge</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ amount: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80&w=1200"
                  className="w-full h-full object-cover"
                  alt="HopeBridge team"
                />
              </div>
              <div className="absolute -top-8 -right-8 bg-emerald-600 text-white p-6 rounded-3xl shadow-xl">
                <p className="text-4xl font-black">98%</p>
                <p className="text-sm font-bold text-emerald-100">Funds reach hospitals directly</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 block">What We Stand For</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Principles that never bend.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ amount: 0.2 }}
                className="group p-8 rounded-[28px] bg-slate-50 hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TEAM --- */}
      <section className="py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 block">The Humans Behind It</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
              A team obsessed with trust.
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              We combine healthcare expertise, technology, and operational excellence to 
              build a platform that truly deserves your trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ amount: 0.2 }}
                className="group text-center p-8 rounded-[28px] bg-white hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className={`w-20 h-20 rounded-3xl ${member.color} flex items-center justify-center text-2xl font-black mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-emerald-600 mb-4">{member.role}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- JOIN CTA --- */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-8" />
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">
              Join the movement.
            </h2>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed">
              Whether you need help or want to give it — HopeBridge is your platform.
              Every action, no matter how small, builds the bridge.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/cases" className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg flex items-center justify-center transition-colors">
                Explore Cases
              </Link>
              <Link href="/create-case" className="h-16 px-12 rounded-2xl border border-white/20 text-white bg-transparent hover:bg-white/10 font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                Start a Campaign <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
