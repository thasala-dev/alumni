"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DiscussionTopicPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ไม่พบกระทู้ที่คุณต้องการ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            กระทู้ที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ
          </p>
          <Link href="/dashboard/discussion">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้ากระทู้
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
