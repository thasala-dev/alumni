"use client";

import type React from "react";

import { useState } from "react";
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
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithFacebook,
} from "@/lib/auth";
import { DemoNotice } from "@/components/demo-notice";
import { Facebook, Mail, Lock, LogIn } from "lucide-react";
// Removed: import { isSupabaseConfigured } from "@/lib/supabase"

// isDemoMode is now always true as we are using mock data
const isDemoMode = true;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signInWithEmail(email, password);

    if (authError) {
      setError(authError.message);
    } else if (data?.user) {
      // Demo mode handles localStorage internally in lib/auth.ts
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error: authError } = await signInWithGoogle();

    if (authError) {
      setError((authError as any)?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } else if (data?.user) {
      // Demo mode handles localStorage internally in lib/auth.ts
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error: authError } = await signInWithFacebook();

    if (authError) {
      setError((authError as any)?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } else if (data?.user) {
      // Demo mode handles localStorage internally in lib/auth.ts
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-x-hidden p-4 transition-all duration-500">
      {/* Decorative blurred shapes */}
      <div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800/30 dark:via-indigo-800/30 dark:to-purple-800/30 rounded-full blur-3xl opacity-40 animate-pulse z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-[300px] h-[300px] bg-gradient-to-tr from-pink-200 via-blue-100 to-indigo-100 dark:from-pink-800/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 animate-pulse z-0"
        aria-hidden="true"
      />

      {/* Additional floating elements for enhanced design */}
      <div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 dark:from-yellow-600/20 dark:to-orange-600/20 rounded-full blur-2xl animate-bounce opacity-60"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-green-200/30 to-teal-300/30 dark:from-green-600/20 dark:to-teal-600/20 rounded-full blur-2xl animate-pulse opacity-50"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {isDemoMode && <DemoNotice />}
        <Card className="p-0 shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl animate-fade-in-up hover:shadow-3xl transition-all duration-300 border border-white/20 dark:border-gray-700/50">
          <CardHeader className="text-center py-4 relative overflow-hidden">
            {/* Header gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-purple-400/10 rounded-t-3xl" />
            <div className="relative">
              <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent drop-shadow mb-1">
                ระบบศิษย์เก่า
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 font-medium">
                สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
              </CardDescription>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                เข้าสู่ระบบเพื่อเชื่อมต่อกับเพื่อนศิษย์เก่า
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2 pb-6 relative">
            {/* Content gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/30 rounded-b-3xl" />

            <div className="relative space-y-6">
              {/* Admin Login Form */}
              <form
                onSubmit={handleEmailLogin}
                className="space-y-4 animate-fade-in-up delay-100"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    อีเมล (สำหรับผู้ดูแลระบบ)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com, alumni@example.com, pending@example.com"
                    required
                    className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    รหัสผ่าน
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123, alumni123, pending123"
                    required
                    className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105 border-0 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      กำลังเข้าสู่ระบบ...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      เข้าสู่ระบบ (Demo)
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider with enhanced gradient */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-600 opacity-60" />
                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-700">
                  หรือ
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-600 opacity-60" />
              </div>

              {/* Social Login for Alumni */}
              <div className="space-y-4 animate-fade-in-up delay-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                    สำหรับศิษย์เก่าสำนักเภสัชศาสตร์
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    เข้าสู่ระบบผ่านบัญชีโซเชียลมีเดีย
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 shadow-md hover:shadow-lg transition-all duration-300 scale-100 hover:scale-105 backdrop-blur-sm"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Mail className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">
                    เข้าสู่ระบบด้วย Google (Demo)
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 shadow-md hover:shadow-lg transition-all duration-300 scale-100 hover:scale-105 backdrop-blur-sm"
                  onClick={handleFacebookLogin}
                  disabled={loading}
                >
                  <Facebook className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">
                    เข้าสู่ระบบด้วย Facebook (Demo)
                  </span>
                </Button>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
