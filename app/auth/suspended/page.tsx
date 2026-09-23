"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuspendedPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleGoBack = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-x-hidden p-4 transition-all duration-500">
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900 rounded-full blur-3xl opacity-40 animate-pulse z-0"
        aria-hidden="true"
      />
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl rounded-3xl animate-fade-in-up border border-white/20 dark:border-orange-400/40">
        <CardHeader className="text-center pb-2 pt-8 relative overflow-hidden">
          <div className="relative flex flex-col items-center">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 shadow-inner">
              <ShieldAlert className="h-10 w-10 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-orange-500 drop-shadow">
              บัญชีถูกระงับ
            </CardTitle>
            <CardDescription className="text-orange-400 mt-1">
              บัญชีของคุณถูกระงับการใช้งานชั่วคราว
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center pb-8">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg border border-orange-200 dark:border-orange-800 shadow-sm">
            <p className="text-base text-orange-600 dark:text-orange-400 leading-relaxed">
              บัญชีของคุณถูกระงับการใช้งานชั่วคราว
              <br />
              หากมีข้อสงสัยกรุณาติดต่อผู้ดูแลระบบ
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="flex items-center gap-2 bg-[#81B214] hover:bg-[#A3C957] text-white font-bold shadow-md border-0"
            >
              <a href="/">
                <Home className="h-4 w-4" />
                กลับหน้าหลัก
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center gap-2 border-orange-300 dark:border-orange-700 text-orange-500 dark:text-orange-400 font-bold hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <ArrowLeft className="h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
