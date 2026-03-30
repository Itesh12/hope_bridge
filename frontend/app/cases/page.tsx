"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  MapPin,
  Heart,
  Droplets,
  Activity,
  X,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";

const CATEGORIES = ["All", "Surgery", "Cancer", "Emergency", "Transplant", "Rare Disease"];

const SORT_OPTIONS = [
  { label: "Most Urgent", value: "urgent" },
  { label: "Most Funded", value: "funded" },
  { label: "Newest", value: "newest" },
  { label: "Closing Soon", value: "closing" },
];

const helpTypeIcon = (type: string) => {
  if (type === "blood") return <Droplets className="w-3 h-3" />;
  if (type === "marrow") return <Activity className="w-3 h-3" />;
  return <Heart className="w-3 h-3" />;
};

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("urgent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const res = await api.get('/cases');
        setCases(res.data.cases);
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const filteredCases = useMemo(() => {
    let result = [...cases];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.headline.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.disease.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((c) => c.category === activeCategory);
    }

    // Sort
    switch (sortBy) {
      case "urgent":
        result.sort((a, b) => Number(b.isUrgent) - Number(a.isUrgent));
        break;
      case "funded":
        result.sort(
          (a, b) =>
            (b.raisedAmount || 0) / (b.targetAmount || 1) - (a.raisedAmount || 0) / (a.targetAmount || 1)
        );
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [search, activeCategory, sortBy, cases]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── HEADER ── */}
      <section className="pt-32 pb-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 block">
              Verified Medical Cases
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Every case is a <span className="text-emerald-600 italic">real</span> life.
              </h1>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                All cases below have been manually verified by our compliance team.
              </p>
            </div>

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, disease, or hospital..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-14 px-6 rounded-2xl border font-bold text-sm flex items-center gap-2 transition-all ${showFilters ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Sort Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`h-9 px-4 rounded-xl text-xs font-black transition-all ${
                    sortBy === opt.value
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Category Chips */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-3 mt-4"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-black transition-all ${
                        activeCategory === cat
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── CASES GRID ── */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Result Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-slate-500 font-medium">
              Showing <span className="font-black text-slate-900">{filteredCases.length}</span> verified cases
              {activeCategory !== "All" && <> in <span className="text-emerald-600 font-black">{activeCategory}</span></>}
            </p>
            {(search || activeCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {filteredCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-400 mb-2">No cases found</h3>
              <p className="text-slate-400">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCases.map((item) => {
                  const pct = Math.round((item.raisedAmount / item.targetAmount) * 100);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer h-full"
                    >
                      <Card className="h-full border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-white hover:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[28px] overflow-hidden flex flex-col pt-0">
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={item.image}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={item.headline}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {item.isUrgent && (
                              <Badge className="bg-red-500 text-white border-none font-bold px-2.5 py-0.5 text-xs shadow-lg">
                                ⚡ Urgent — {item.daysLeft}d left
                              </Badge>
                            )}
                          </div>
                          <div className="absolute top-3 right-3">
                            {item.isVerified && (
                              <Badge className="bg-white/95 backdrop-blur text-emerald-700 border-none font-bold px-2.5 py-0.5 text-xs flex gap-1 items-center shadow-lg">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </Badge>
                            )}
                          </div>

                          {/* Help-type chips at bottom of image */}
                          <div className="absolute bottom-3 left-3 flex gap-1.5">
                            {item.helpType.map((ht: string) => (
                              <span key={ht} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur text-white text-xs font-bold capitalize">
                                {helpTypeIcon(ht)} {ht}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Header */}
                        <CardHeader className="p-6 pb-3 flex-shrink-0">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2 block">
                            {item.category}
                          </span>
                          <CardTitle className="text-lg font-black text-slate-900 leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
                            {item.headline}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                              {item.patientName[0]}
                            </div>
                            <span className="font-semibold">{item.patientName}, {item.age} yrs</span>
                            <span>·</span>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item.location.split(",")[0]}</span>
                          </div>
                        </CardHeader>

                        {/* Content: funding progress */}
                        <CardContent className="px-6 pb-4 flex-grow">
                          <div className="text-xs text-slate-400 font-medium mb-2 truncate italic">{item.disease}</div>
                          <div className="space-y-3 mt-3">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-lg font-black text-slate-900">
                                  ₹{item.raisedAmount.toLocaleString("en-IN")}
                                </p>
                                <p className="text-xs text-slate-400 font-medium">raised of ₹{item.targetAmount.toLocaleString("en-IN")}</p>
                              </div>
                              <span className={`text-2xl font-black ${pct >= 80 ? "text-emerald-600" : pct >= 40 ? "text-amber-500" : "text-slate-400"}`}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${pct}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-slate-300"}`}
                              />
                            </div>
                          </div>
                        </CardContent>

                        {/* Footer */}
                        <CardFooter className="px-6 pb-6 mt-auto">
                          <Link
                            href={`/cases/${item.id}`}
                            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 transition-all group-hover:shadow-xl group-hover:shadow-emerald-100"
                          >
                            Support {item.patientName.split(" ")[0]}
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── PATIENT CTA STRIP ── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[32px] bg-emerald-600">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">Need medical help?</h3>
              <p className="text-emerald-100 font-medium">Start your case today — verified and live in under 48 hours.</p>
            </div>
            <Link
              href="/create-case"
              className="flex-shrink-0 h-14 px-10 rounded-2xl bg-white text-emerald-700 font-black hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-xl shadow-emerald-800/20"
            >
              Start Your Case <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
