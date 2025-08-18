"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">🔍</div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            ไม่พบหน้าที่ต้องการ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            ขออภัย หน้าที่คุณกำลังมองหาไม่มีอยู่ในระบบ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                กลับหน้าหลัก
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center gap-2"
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
