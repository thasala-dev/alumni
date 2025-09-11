"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { DemoNotice } from "@/components/demo-notice";
import { Facebook, Mail, Lock, LogIn, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { is } from "date-fns/locale";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { user, isLoading, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn && user) {
      if (user.status === "APPROVED") {
        router.push("/dashboard");
      } else if (user.status === "PENDING_APPROVAL") {
        router.push("/auth/pending-approval");
      } else if (user.status === "UNREGISTERED") {
        router.push("/auth/verify-identity");
      }
    }
  }, [router, isLoading, user]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("google", {
      callbackUrl: "/dashboard",
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("facebook", {
      callbackUrl: "/dashboard",
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("apple", {
      callbackUrl: "/dashboard",
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-x-hidden p-4 transition-all duration-500">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-green-200 via-indigo-200 to-purple-200 dark:from-green-900 dark:via-indigo-900 dark:to-purple-900 rounded-full blur-3xl opacity-40 animate-pulse z-0"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10 space-y-4">
        <Card className="p-0 shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl animate-fade-in-up hover:shadow-3xl transition-all duration-300 border border-white/20 dark:border-[#81B214]/40">
          <div className="text-center relative overflow-hidden">
            <div className="relative flex flex-col items-center gap-2 pt-6 pb-2">
              <img src="/images/logo.png" alt="Logo" className="h-20" />
              {/* <CardTitle className="text-3xl font-extrabold text-[#81B214] drop-shadow mb-1">
                ระบบศิษย์เก่า
              </CardTitle> */}
              <CardDescription className="text-base text-[#81B214] dark:text-[#A3C957] font-medium">
                ระบบศิษย์เก่า สำนักวิชาเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
              </CardDescription>
            </div>
          </div>
          <div className="space-y-4 p-4 relative">
            {/* Social Login for Alumni */}
            <div className="space-y-4 animate-fade-in-up delay-200">
              <Button
                variant="outline"
                className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl border-[#A3C957] dark:border-[#81B214] hover:border-[#81B214] dark:hover:border-[#A3C957] hover:text-[#81B214] dark:hover:text-[#A3C957] hover:bg-[#E2F9B8]/60 dark:hover:bg-[#A3C957]/20 shadow-md hover:shadow-lg transition-all duration-300 scale-100 hover:scale-105 backdrop-blur-sm"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img
                  src="/images/google.png"
                  alt="Google Logo"
                  className="h-5 w-5"
                />
                <span className="font-medium">เข้าสู่ระบบด้วย Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl border-[#A3C957] dark:border-[#81B214] hover:border-[#81B214] dark:hover:border-[#A3C957] hover:text-[#81B214] dark:hover:text-[#A3C957] hover:bg-[#E2F9B8]/60 dark:hover:bg-[#A3C957]/20 shadow-md hover:shadow-lg transition-all duration-300 scale-100 hover:scale-105 backdrop-blur-sm"
                onClick={handleFacebookLogin}
                disabled={loading}
              >
                <img
                  src="/images/facebook.png"
                  alt="Facebook Logo"
                  className="h-5 w-5"
                />
                <span className="font-medium">เข้าสู่ระบบด้วย Facebook</span>
              </Button>
              {/* <Button
                variant="outline"
                className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl border-[#A3C957] dark:border-[#81B214] hover:border-[#81B214] dark:hover:border-[#A3C957] hover:text-[#81B214] dark:hover:text-[#A3C957] hover:bg-[#E2F9B8]/60 dark:hover:bg-[#A3C957]/20 shadow-md hover:shadow-lg transition-all duration-300 scale-100 hover:scale-105 backdrop-blur-sm"
                onClick={handleAppleLogin}
                disabled={loading}
              >
                <img src="/images/apple.png" alt="Apple Logo" className="h-5" />
                <span className="font-medium">เข้าสู่ระบบด้วย Apple</span>
              </Button> */}
            </div>

            {error && (
              <div className="animate-fade-in-up delay-300">
                <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4 rounded-xl shadow-md backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Divider with enhanced gradient */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#A3C957] to-transparent dark:via-[#81B214] opacity-60" />
              <span className="text-[#81B214] dark:text-[#A3C957] text-sm font-medium px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full border border-[#A3C957]/40 dark:border-[#81B214]/40">
                หรือ
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#A3C957] to-transparent dark:via-[#81B214] opacity-60" />
            </div>

            <div className="relative space-y-4">
              <form
                onSubmit={handleEmailLogin}
                className="space-y-4 animate-fade-in-up delay-100"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-medium text-[#81B214] dark:text-[#A3C957] flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#81B214] dark:text-[#A3C957]" />
                    Email / Username
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email / Username"
                    required
                    className="rounded-xl border-gray-300 dark:border-[#A3C957] focus:border-[#81B214] dark:focus:border-[#A3C957] focus:ring-[#A3C957]/30 dark:focus:ring-[#81B214]/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-medium text-[#81B214] dark:text-[#A3C957] flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-[#81B214] dark:text-[#A3C957]" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="rounded-xl border-gray-300 dark:border-[#A3C957] focus:border-[#81B214] dark:focus:border-[#A3C957] focus:ring-[#A3C957]/30 dark:focus:ring-[#81B214]/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl text-lg font-bold bg-gradient-to-r from-[#81B214] to-[#50B003] shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105 border-0 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#A3C957]/30 border-t-[#81B214] rounded-full animate-spin" />
                      กำลังเข้าสู่ระบบ...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      เข้าสู่ระบบ
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </Card>
        {/* {isDemoMode && <DemoNotice />} */}
      </div>
    </div>
  );
}
