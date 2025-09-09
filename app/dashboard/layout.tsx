"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarMenuItems from "@/components/navbar-menu";
import AsideMenuItems from "@/components/aside-menu";
import { useAuth } from "@/contexts/auth-context";
import { Analytics } from "@vercel/analytics/next";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    if (user && user.status === "PENDING_APPROVAL") {
      router.push("/auth/pending-approval");
      return;
    } else if (user && user.status === "UNREGISTERED") {
      router.push("/auth/verify-identity");
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavbarMenuItems />
      <div className="max-w-7xl mx-auto flex flex-row gap-4 px-2 sm:px-4 lg:px-6 py-6">
        <AsideMenuItems />
        <Analytics />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
