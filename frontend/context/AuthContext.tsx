"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "patient" | "donor" | "admin";
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: any) => Promise<any>;
  register: (userData: FormData) => Promise<any>;
  logout: () => void;
  updateUser: (userData: FormData) => Promise<void>;
  updatePassword: (passwordData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (userData: any) => {
    try {
      const res = await api.post("/auth/login", userData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
       throw error;
    }
  };

  const register = async (userData: FormData) => {
    try {
      const res = await api.post("/auth/register", userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const updateUser = async (userData: FormData) => {
    try {
      const res = await api.put("/auth/updatedetails", userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (passwordData: any) => {
    try {
      await api.put("/auth/updatepassword", passwordData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
