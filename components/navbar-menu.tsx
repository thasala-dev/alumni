"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlumniSearchBox from "@/components/AlumniSearchBox";
import {
  Users,
  Map,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  UserPlus,
  ChevronDown,
  Bell,
} from "lucide-react";
import { signOut } from "@/lib/auth";

export default function NavbarMenuItems() {
  const [notifications] = useState([
    { id: 1, message: "มีการอนุมัติสมาชิกใหม่แล้ว" },
    { id: 2, message: "มีข่าวสารใหม่ในระบบ" },
  ]);

  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mock login (replace with real auth session in production)
    setUser({ name: "Admin", role: "admin" });
  }, []);

  const navigation = [
    { name: "ศิษย์เก่า", href: "/dashboard/alumni", icon: Users },
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
  ];

  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (!res?.error) {
        router.push("/auth/login");
      } else {
        console.error("Sign out error:", res.error);
      }
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/90 dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/placeholder-logo.svg"
              alt="Logo"
              className="h-8 w-8 rounded bg-blue-600 p-1"
            />
            <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
              Alumni
            </span>
          </Link>

          <div className="hidden md:block w-64">
            <AlumniSearchBox />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded transition font-medium
                  ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-neutral-800"
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
                <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {notifications.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0 rounded-xl shadow-lg bg-white dark:bg-neutral-950"
            >
              <div className="font-semibold px-5 py-3 border-b dark:border-neutral-800 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                การแจ้งเตือน
              </div>
              <div className="max-h-80 overflow-y-auto divide-y dark:divide-neutral-900">
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="px-5 py-4 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="h-2 w-2 mt-1 bg-blue-500 rounded-full" />
                      <div>
                        {n.message}
                        <div className="text-xs text-gray-400 mt-1">
                          เมื่อสักครู่
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="border-t dark:border-neutral-800 px-5 py-2 text-center">
                <Link
                  href="/dashboard/news"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  ดูการแจ้งเตือนทั้งหมด
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group">
                <img
                  src="/placeholder-user.jpg"
                  alt="User"
                  className="h-9 w-9 rounded-full border-2 border-blue-200 dark:border-blue-700 object-cover"
                />
                <span className="hidden md:inline text-sm font-semibold text-gray-800 dark:text-gray-100">
                  บัญชีของฉัน
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  ตั้งค่า
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 bg-white dark:bg-neutral-950"
            >
              <div className="p-4 border-b dark:border-neutral-800 flex items-center gap-2">
                <img
                  src="/placeholder-logo.svg"
                  alt="Alumni Logo"
                  className="h-8 w-8 rounded bg-blue-600 p-1"
                />
                <span className="font-extrabold text-xl text-blue-700 dark:text-blue-400">
                  Alumni
                </span>
              </div>
              <div className="px-4 mt-4">
                <AlumniSearchBox />
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium
                        ${
                          isActive
                            ? "bg-blue-100 text-blue-700 dark:bg-neutral-800 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800"
                        }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="mt-4 text-red-600 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  ออกจากระบบ
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
