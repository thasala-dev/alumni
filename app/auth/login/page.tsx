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
import { Facebook, Mail } from "lucide-react";
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
      setError(authError.message);
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
      setError(authError.message);
    } else if (data?.user) {
      // Demo mode handles localStorage internally in lib/auth.ts
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative overflow-x-hidden p-4">
      {/* Decorative blurred shapes */}
      <div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-full blur-3xl opacity-40 animate-pulse z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-[300px] h-[300px] bg-gradient-to-tr from-pink-200 via-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse z-0"
        aria-hidden="true"
      />
      <div className="w-full max-w-md relative z-10">
        {isDemoMode && <DemoNotice />}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur rounded-2xl animate-fade-in-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold text-blue-700 drop-shadow mb-1">
              ระบบศิษย์เก่า
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              เข้าสู่ระบบเพื่อเชื่อมต่อกับเพื่อนศิษย์เก่า
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2 pb-6">
            {/* Admin Login Form */}
            <form
              onSubmit={handleEmailLogin}
              className="space-y-4 animate-fade-in-up delay-100"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-gray-700">
                  อีเมล (สำหรับผู้ดูแลระบบ)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com, alumni@example.com, pending@example.com"
                  required
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-gray-700">
                  รหัสผ่าน
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123, alumni123, pending123"
                  required
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white/80"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-200 scale-100 hover:scale-105"
                disabled={loading}
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ (Demo)"}
              </Button>
            </form>

            {/* Divider with gradient */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-full opacity-60" />
              <span className="text-gray-400 text-xs">หรือ</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-full opacity-60" />
            </div>

            {/* Social Login for Alumni */}
            <div className="space-y-3 animate-fade-in-up delay-200">
              <p className="text-sm text-gray-600 text-center">
                สำหรับศิษย์เก่า เข้าสู่ระบบผ่าน
              </p>
              <Button
                variant="outline"
                className="w-full bg-white/80 rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-600 shadow transition-all duration-200 scale-100 hover:scale-105"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                เข้าสู่ระบบด้วย Google (Demo)
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white/80 rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-600 shadow transition-all duration-200 scale-100 hover:scale-105"
                onClick={handleFacebookLogin}
                disabled={loading}
              >
                <Facebook className="mr-2 h-5 w-5 text-blue-600" />
                เข้าสู่ระบบด้วย Facebook (Demo)
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg shadow animate-fade-in-up delay-300">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
