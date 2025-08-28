"use client";

import type React from "react";
import { DropdownMenuDescription } from "@/components/ui/dropdown-menu"; // Import DropdownMenuDescription

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Map,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Home,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { getCurrentUser, signOut, type User } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DemoNotice } from "@/components/demo-notice"; // Import DemoNotice
import NavbarMenuItems from "@/components/navbar-menu";
import AsideMenuItems from "@/components/aside-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      if (
        currentUser.email === "pending@example.com" &&
        currentUser.status === "PENDING_APPROVAL"
      ) {
        router.push("/auth/verify-identity");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navigation = [
    { name: "หน้าหลัก", href: "/dashboard", icon: Home },
    { name: "ข้อมูลศิษย์เก่า", href: "/dashboard/alumni", icon: Users },
    { name: "แผนที่", href: "/dashboard/map", icon: Map },
    { name: "ข่าวสาร", href: "/dashboard/news", icon: Newspaper },
    { name: "เว็บบอร์ด", href: "/dashboard/discussion", icon: MessageSquare },
    ...(user?.role === "admin"
      ? [
          {
            name: "จัดการผู้ใช้",
            href: "/dashboard/admin/users",
            icon: UserPlus,
          },
        ]
      : []),
    { name: "ตั้งค่า", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <NavbarMenuItems />
      <div className="max-w-7xl mx-auto flex flex-row gap-6 px-4 sm:px-6 lg:px-8 py-8">
        <AsideMenuItems />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
