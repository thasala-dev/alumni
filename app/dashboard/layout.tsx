"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import NavbarMenuItems from "@/components/navbar-menu";
import AsideMenuItems from "@/components/aside-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  type UserWithStatus = typeof session extends { user?: infer U }
    ? U & { status?: string }
    : { status?: string };
  const user = session?.user as UserWithStatus;

  useEffect(() => {
    if (status === "loading") return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.status === "PENDING_APPROVAL") {
      router.push("/auth/pending-approval");
      return;
    } else if (user.status === "UNREGISTERED") {
      router.push("/auth/verify-identity");
      return;
    }
  }, [user, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavbarMenuItems />
      <div className="max-w-7xl mx-auto flex flex-row gap-4 px-4 sm:px-6 lg:px-8 py-8">
        <AsideMenuItems />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
