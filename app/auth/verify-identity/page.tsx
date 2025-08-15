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
import {
  Shield,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function VerifyIdentityPage() {
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (nationalId.length !== 13) {
      setError("เลขบัตรประชาชนต้องมี 13 หลัก");
      setLoading(false);
      return;
    }

    // Simulate identity verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For demo, we simulate success and redirect
    console.log("Simulating identity verification for:", {
      nationalId,
      birthDate,
    });

    router.push("/auth/pending-approval");
    setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  const formatNationalId = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Format as X-XXXX-XXXXX-XX-X
    if (numbers.length <= 1) return numbers;
    if (numbers.length <= 5)
      return `${numbers.slice(0, 1)}-${numbers.slice(1)}`;
    if (numbers.length <= 10)
      return `${numbers.slice(0, 1)}-${numbers.slice(1, 5)}-${numbers.slice(
        5
      )}`;
    if (numbers.length <= 12)
      return `${numbers.slice(0, 1)}-${numbers.slice(1, 5)}-${numbers.slice(
        5,
        10
      )}-${numbers.slice(10)}`;
    return `${numbers.slice(0, 1)}-${numbers.slice(1, 5)}-${numbers.slice(
      5,
      10
    )}-${numbers.slice(10, 12)}-${numbers.slice(12, 13)}`;
  };

  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNationalId(e.target.value);
    setNationalId(formatted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg p-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              ยืนยันตัวตน
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
              กรุณากรอกข้อมูลเพื่อยืนยันตัวตนของคุณ
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* National ID Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nationalId"
                  className="flex items-center font-medium text-gray-900 dark:text-white"
                >
                  <User className="mr-2 h-4 w-4 text-blue-500" />
                  เลขบัตรประชาชน
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  value={nationalId}
                  onChange={handleNationalIdChange}
                  placeholder="X-XXXX-XXXXX-XX-X"
                  maxLength={17} // Including dashes
                  required
                  className="h-12 text-lg focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  กรอกเลขบัตรประชาชน 13 หลัก
                </p>
              </div>

              {/* Birth Date Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="birthDate"
                  className="flex items-center font-medium text-gray-900 dark:text-white"
                >
                  <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                  วันเกิด
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="h-12 text-lg focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center p-4 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    ส่งข้อมูลเพื่อรออนุมัติ
                  </>
                )}
              </Button>
            </form>

            {/* Information Notice */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <Shield className="mr-3 h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">ข้อมูลความปลอดภัย</p>
                  <p className="text-xs leading-relaxed">
                    ข้อมูลของคุณจะถูกเข้ารหัสและส่งไปยังผู้ดูแลระบบเพื่อตรวจสอบและอนุมัติ
                    เราใช้มาตรฐานความปลอดภัยระดับสูงในการปกป้องข้อมูลส่วนบุคคลของคุณ
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Indicator */}
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>ยืนยันตัวตน</span>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <span>รออนุมัติ</span>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <span>เสร็จสิ้น</span>
            </div>
          </CardContent>
        </Card>

        {/* University Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            คณะเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            ระบบเครือข่ายศิษย์เก่า
          </p>
        </div>
      </div>
    </div>
  );
}
