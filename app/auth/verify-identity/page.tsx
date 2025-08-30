"use client";

import type React from "react";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { DatePicker } from "@/components/date-picker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
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
  Home,
} from "lucide-react";
import Link from "next/link";

function formatDateToInput(dateStr: string) {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

function formatDateToDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

export default function VerifyIdentityPage() {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!nationalId || !birthDate) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
      return;
    }

    const nationalIdWithoutDashes = nationalId.replace(/\D/g, "");

    if (nationalIdWithoutDashes.length !== 13) {
      setError("หมายเลขบัตรประชาชนต้องมี 13 หลัก");
      setLoading(false);
      return;
    }

    try {
      // ส่ง birthDate เป็น yyyy-MM-dd (ISO format)
      const birthDateString = birthDate ? format(birthDate, "yyyy-MM-dd") : "";
      const res = await fetch("/api/verifyIdentity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationalId: nationalIdWithoutDashes,
          birthDate: birthDateString,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched alumni profiles:", data);
      }
    } catch (e) {
      console.error("Error fetching alumni profiles:", e);
    }

    // router.push("/auth/verify-identity");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-x-hidden p-4 transition-all duration-500">
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-green-200 via-indigo-200 to-purple-200 dark:from-green-900 dark:via-indigo-900 dark:to-purple-900 rounded-full blur-3xl opacity-40 animate-pulse z-0"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl rounded-3xl animate-fade-in-up border border-white/20 dark:border-[#81B214]/40">
          <div className="text-center space-y-4 rounded-t-lg p-4 pb-0 flex items-center gap-4 justify-center">
            <div className="w-14 h-14 bg-[#81B214]/10 dark:bg-[#A3C957]/10 rounded-full flex items-center justify-center shadow-inner">
              <Shield className="h-8 w-8 text-[#81B214] dark:text-[#A3C957]" />
            </div>
            <div className="text-2xl font-extrabold text-[#81B214] drop-shadow">
              ยืนยันตัวตน
            </div>
          </div>

          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* National ID Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="nationalId"
                  className="flex items-center font-medium text-gray-900 dark:text-white"
                >
                  <User className="mr-2 h-4 w-4 text-[#81B214] dark:text-[#A3C957]" />
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
                  className="h-12 text-center focus-visible:ring-2 focus-visible:ring-[#81B214] dark:focus-visible:ring-[#A3C957] border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50"
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
                  <Calendar className="mr-2 h-4 w-4 text-[#A3C957] dark:text-[#C7E77F]" />
                  วันเกิด
                </Label>
                <DatePicker
                  date={birthDate}
                  onDateChange={(value) => {
                    setBirthDate(value ? value.toISOString() : "");
                  }}
                  className="h-12 text-center focus-visible:ring-2 focus-visible:ring-[#81B214] dark:focus-visible:ring-[#A3C957] border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50"
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
                className="w-full h-12 text-lg font-semibold bg-[#81B214] hover:bg-[#A3C957] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <div className="mt-8 p-4 bg-[#E2F9B8] dark:bg-[#A3C957]/20 border border-[#A3C957] dark:border-[#81B214] rounded-lg">
              <div className="flex items-start">
                <Shield className="mr-3 h-5 w-5 text-[#81B214] dark:text-[#A3C957] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-[#81B214] dark:text-[#A3C957]">
                  <p className="font-medium mb-1">ข้อมูลความปลอดภัย</p>
                  <p className="text-xs leading-relaxed">
                    ข้อมูลของคุณจะถูกเข้ารหัสและส่งไปยังผู้ดูแลระบบเพื่อตรวจสอบและอนุมัติ
                    เราใช้มาตรฐานความปลอดภัยระดับสูงในการปกป้องข้อมูลส่วนบุคคลของคุณ
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button
                asChild
                className="flex items-center gap-2 bg-[#81B214] hover:bg-[#A3C957] text-white font-bold shadow-md border-0"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  กลับหน้าหลัก
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex items-center gap-2 border-[#A3C957] dark:border-[#81B214] text-[#81B214] dark:text-[#A3C957] font-bold hover:bg-[#E2F9B8]/60 dark:hover:bg-[#A3C957]/20"
              >
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
