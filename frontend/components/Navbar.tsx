"use client";

import Link from "next/link";
import { HeartPulse, User as UserIcon, LogOut, LayoutDashboard, PlusCircle, ChevronDown, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const pathname = usePathname();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/cases", label: "Explore Cases" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-emerald-50 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl text-slate-900 tracking-tighter">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-emerald-600" />
          </div>
          <span>HopeBridge</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-400">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`transition-colors ${pathname === link.href ? "text-emerald-600" : "hover:text-emerald-600"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          {user ? (
            <>
              {user.role !== 'donor' && (
                <Link 
                  href="/create-case" 
                  className="hidden md:flex h-10 px-6 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all font-black text-[10px] uppercase tracking-widest items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Start a Case
                </Link>
              )}

              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <Avatar className="h-10 w-10 rounded-xl border-2 border-white shadow-sm ring-2 ring-emerald-50">
                    {user.profileImage && (
                      <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-emerald-600 text-white font-black text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 overflow-hidden z-[60]"
                    >
                      <div className="px-4 py-4 border-b border-slate-50 mb-1">
                        <p className="text-sm font-black text-slate-900">{user.name}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 opacity-70">{user.role}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link 
                          href="/cases" 
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm group ${
                            pathname === '/cases' ? "bg-slate-50 text-emerald-700" : "hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <LayoutDashboard className={`w-4 h-4 transition-colors ${pathname === '/cases' ? "text-emerald-600" : "group-hover:text-emerald-600"}`} />
                          Explore Cases
                        </Link>
                        {user.role === 'admin' && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black text-sm group ${
                              pathname.startsWith('/admin') ? "bg-emerald-50 text-emerald-700 font-black" : "hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <ShieldCheck className={`w-4 h-4 transition-colors ${pathname.startsWith('/admin') ? "text-emerald-600" : "group-hover:text-emerald-600"}`} />
                            Admin Panel
                          </Link>
                        )}
                        <Link 
                          href="/profile" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-600 font-bold text-sm group"
                        >
                          <UserIcon className="w-4 h-4 group-hover:text-emerald-600 transition-colors" />
                          My Profile
                        </Link>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-50">
                        <button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition-colors text-red-600 font-bold text-sm group text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 px-4"
              >
                Login
              </Link>
              <Link 
                href="/create-case" 
                className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center"
              >
                Start a Case
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
