"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Removed: import { supabase } from "@/lib/supabase"

export default function VerifyIdentityPage() {
  const [nationalId, setNationalId] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate identity verification success
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    // In a real app, you'd save this to your backend/DB
    // For demo, we just simulate success and redirect
    console.log("Simulating identity verification for:", { nationalId, birthDate })

    router.push("/auth/pending-approval")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl"> {/* Added shadow and rounded corners */}
        <CardHeader className="text-center space-y-2"> {/* Adjusted spacing */}
          <CardTitle className="text-3xl font-extrabold text-gray-900">ยืนยันตัวตน</CardTitle> {/* Larger, bolder title */}
          <CardDescription className="text-gray-600">กรุณากรอกข้อมูลเพื่อยืนยันตัวตนของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
            <div className="space-y-2">
              <Label htmlFor="nationalId" className="font-medium text-gray-700">เลขบัตรประชาชน</Label> {/* Bolder label */}
              <Input
                id="nationalId"
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="1234567890123"
                maxLength={13}
                required
                className="focus-visible:ring-blue-500" {/* Consistent focus ring */}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="font-medium text-gray-700">วันเกิด</Label> {/* Bolder label */}
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="focus-visible:ring-blue-500" {/* Consistent focus ring */}
              />
            </div>
            <Button type="submit" className="w-full py-2.5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg" disabled={loading}> {/* Larger, more prominent button */}
              {loading ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลเพื่อรออนุมัติ"}
            </Button>
          </form>

          {error && <div className="mt-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>} {/* Enhanced error message styling */}

          <div className="mt-6 text-xs text-gray-500 text-center">ข้อมูลของคุณจะถูกส่งไปยังผู้ดูแลระบบเพื่อตรวจสอบและอนุมัติ</div> {/* Adjusted spacing */}
        </CardContent>
      </Card>
    </div>
  )
}
