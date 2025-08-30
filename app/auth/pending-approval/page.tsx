"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function PendingApprovalPage() {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-x-hidden p-4 transition-all duration-500">
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-green-200 via-indigo-200 to-purple-200 dark:from-green-900 dark:via-indigo-900 dark:to-purple-900 rounded-full blur-3xl opacity-40 animate-pulse z-0"
        aria-hidden="true"
      />
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl rounded-3xl animate-fade-in-up border border-white/20 dark:border-[#81B214]/40">
        <CardHeader className="text-center pb-2 pt-8 relative overflow-hidden">
          <div className="relative flex flex-col items-center">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#81B214]/10 dark:bg-[#A3C957]/10 shadow-inner">
              <Clock className="h-10 w-10 text-[#81B214]" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-[#81B214] drop-shadow">
              รออนุมัติ
            </CardTitle>
            <CardDescription className="text-[#81B214] mt-1">
              บัญชีของคุณอยู่ระหว่างการตรวจสอบ
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center pb-8">
          <div className="bg-[#E2F9B8] dark:bg-[#A3C957]/20 p-5 rounded-lg border border-[#A3C957] dark:border-[#81B214] shadow-sm">
            <Mail className="h-10 w-10 text-[#81B214] dark:text-[#A3C957] mx-auto mb-3" />
            <p className="text-base text-[#81B214] dark:text-[#A3C957] leading-relaxed">
              เราได้รับข้อมูลของคุณแล้ว
              <br />
              ผู้ดูแลระบบจะตรวจสอบและอนุมัติบัญชีของคุณภายใน 1-2 วันทำการ
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
  );
}
