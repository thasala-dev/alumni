"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth" // Use getCurrentUser from auth.ts

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

      const user = await getCurrentUser() // Get user from demo auth

      if (user) {
        // Simulate user status check
        if (user.status === "PENDING_APPROVAL") {
          router.push("/auth/pending-approval")
        } else if (user.status === "APPROVED") {
          router.push("/dashboard")
        } else {
          // Default to login if status is not recognized (e.g., REJECTED, SUSPENDED)
          router.push("/auth/login?error=account_not_approved")
        }
      } else {
        // If no user found in demo mode after callback, redirect to login
        router.push("/auth/login")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังตรวจสอบข้อมูล...</p>
      </div>
    </div>
  )
}
