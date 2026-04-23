"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  UserCheck,
  UserX,
  Trash2,
  Users,
  UserPlus,
  UserMinus,
  AlertCircle,
  ShieldQuestion,
} from "lucide-react";
import { getCurrentUser, type User } from "@/lib/auth";

import { AdmitYear } from "@/lib/utils";

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "alumni">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<
    | "all"
    | "UNREGISTERED"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "SUSPENDED"
  >("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | "suspend" | "delete" | "role" | "details";
    user?: any;
    newRole?: "admin" | "alumni";
  }>({ open: false, type: "details" });
  const router = useRouter();

  // Fix body pointer-events issue when dialog closes
  useEffect(() => {
    document.body.style.pointerEvents = "";
  }, [actionDialog.open]);

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (e) {
        setUsers([]);
      }
      setLoading(false);
    };
    initializePage();
  }, [router]);

  const handleUpdateUser = async (userId: string, updates: Partial<any>) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Update local state only if API call succeeds
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, ...updates } : user,
          ),
        );
      } else {
        console.error("Failed to update user");
        alert("เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state only if API call succeeds
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        console.error("Failed to delete user");
        alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
  };

  const executeAction = async () => {
    const { type, user, newRole } = actionDialog;
    if (!user) return;

    try {
      switch (type) {
        case "approve":
          await handleUpdateUser(user.id, { status: "APPROVED" });
          break;
        case "reject":
          await handleUpdateUser(user.id, { status: "REJECTED" });
          break;
        case "suspend":
          await handleUpdateUser(user.id, { status: "SUSPENDED" });
          break;
        case "delete":
          await handleDeleteUser(user.id);
          break;
        case "role":
          if (newRole) {
            await handleUpdateUser(user.id, { role: newRole });
          }
          break;
      }
      // Clear dialog state completely after successful action
      setActionDialog({ open: false, type: "details", user: undefined });
      // Force clear pointer-events from body
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    } catch (error) {
      console.error("Error executing action:", error);
      // Keep dialog open if there's an error
    }
  };

  // Bulk operations
  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleBulkApprove = async () => {
    if (
      selectedUsers.length > 0 &&
      confirm(`อนุมัติผู้ใช้ ${selectedUsers.length} คน?`)
    ) {
      try {
        // Update each selected user via API
        await Promise.all(
          selectedUsers.map((userId) =>
            handleUpdateUser(userId, { status: "APPROVED" }),
          ),
        );
        setSelectedUsers([]);
        alert(`อนุมัติผู้ใช้สำเร็จ ${selectedUsers.length} คน`);
      } catch (error) {
        console.error("Error in bulk approve:", error);
        alert("เกิดข้อผิดพลาดในการอนุมัติผู้ใช้");
      }
    }
  };

  const handleBulkReject = async () => {
    if (
      selectedUsers.length > 0 &&
      confirm(`ปฏิเสธผู้ใช้ ${selectedUsers.length} คน?`)
    ) {
      try {
        // Update each selected user via API
        await Promise.all(
          selectedUsers.map((userId) =>
            handleUpdateUser(userId, { status: "REJECTED" }),
          ),
        );
        setSelectedUsers([]);
        alert(`ปฏิเสธผู้ใช้สำเร็จ ${selectedUsers.length} คน`);
      } catch (error) {
        console.error("Error in bulk reject:", error);
        alert("เกิดข้อผิดพลาดในการปฏิเสธผู้ใช้");
      }
    }
  };

  // Approve all pending users
  const handleApproveAll = async () => {
    const pendingUsers = filteredUsers.filter(
      (user) => user.status === "PENDING_APPROVAL",
    );
    if (
      pendingUsers.length > 0 &&
      confirm(`อนุมัติผู้ใช้ที่รออนุมัติทั้งหมด ${pendingUsers.length} คน?`)
    ) {
      try {
        // Update all pending users via API
        await Promise.all(
          pendingUsers.map((user) =>
            handleUpdateUser(user.id, { status: "APPROVED" }),
          ),
        );
        alert(`อนุมัติผู้ใช้สำเร็จ ${pendingUsers.length} คน`);
      } catch (error) {
        console.error("Error in approve all:", error);
        alert("เกิดข้อผิดพลาดในการอนุมัติผู้ใช้ทั้งหมด");
      }
    }
  };

  // Reject all pending users
  const handleRejectAll = async () => {
    const pendingUsers = filteredUsers.filter(
      (user) => user.status === "PENDING_APPROVAL",
    );
    if (
      pendingUsers.length > 0 &&
      confirm(`ปฏิเสธผู้ใช้ที่รออนุมัติทั้งหมด ${pendingUsers.length} คน?`)
    ) {
      try {
        // Update all pending users via API
        await Promise.all(
          pendingUsers.map((user) =>
            handleUpdateUser(user.id, { status: "REJECTED" }),
          ),
        );
        alert(`ปฏิเสธผู้ใช้สำเร็จ ${pendingUsers.length} คน`);
      } catch (error) {
        console.error("Error in reject all:", error);
        alert("เกิดข้อผิดพลาดในการปฏิเสธผู้ใช้ทั้งหมด");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.national_id?.includes(searchTerm) ||
      user.birth_date?.includes(searchTerm);

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: any["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "SUSPENDED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: any["status"]) => {
    switch (status) {
      case "APPROVED":
        return (
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      case "PENDING_APPROVAL":
        return (
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "SUSPENDED":
        return <Ban className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      case "UNREGISTERED":
        return (
          <ShieldQuestion className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#81B214]">
          จัดการบัญชีศิษย์เก่า
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          ยืนยันและจัดการบัญชีศิษย์เก่าที่ลงทะเบียนใหม่
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  รออนุมัติ
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {users.filter((u) => u.status === "PENDING_APPROVAL").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  อนุมัติแล้ว
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    users.filter(
                      (u) => u.status === "APPROVED" && u.role === "alumni",
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ปฏิเสธ
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {users.filter((u) => u.status === "REJECTED").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  รวมทั้งหมด
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {users.filter((u) => u.role === "alumni").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="dark:bg-gray-900/80 dark:border-gray-700 shadow-xl border-0 bg-white/90">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-[#81B214] dark:text-[#A3C957]" />
              <Input
                placeholder="ค้นหาอีเมล / ชื่อ / รหัส"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-base dark:text-gray-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#81B214]/30 focus:border-[#81B214] transition"
              />
            </div>
            <Select
              value={filterRole}
              onValueChange={(value: "all" | "admin" | "alumni") =>
                setFilterRole(value)
              }
            >
              <SelectTrigger className="w-full rounded-2xl py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-base dark:text-gray-100 focus:ring-2 focus:ring-[#81B214]/30 focus:border-[#81B214] transition">
                <SelectValue placeholder="กรองตามบทบาท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกบทบาท</SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                <SelectItem value="alumni">ศิษย์เก่า</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(
                value:
                  | "all"
                  | "PENDING_APPROVAL"
                  | "APPROVED"
                  | "REJECTED"
                  | "SUSPENDED",
              ) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full rounded-2xl py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-base dark:text-gray-100 focus:ring-2 focus:ring-[#81B214]/30 focus:border-[#81B214] transition">
                <SelectValue placeholder="กรองตามสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="PENDING_APPROVAL">รออนุมัติ</SelectItem>
                <SelectItem value="APPROVED">อนุมัติแล้ว</SelectItem>
                <SelectItem value="REJECTED">ถูกปฏิเสธ</SelectItem>
                <SelectItem value="SUSPENDED">ถูกระงับ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gradient-to-r from-[#E2F9B8] via-[#F6FFDE] to-[#A3C957]/40 dark:from-[#A3C957]/20 dark:via-[#F6FFDE]/10 dark:to-[#81B214]/10 border border-[#A3C957] dark:border-[#81B214] rounded-2xl mt-4 shadow-sm">
              <span className="text-sm text-[#81B214] dark:text-[#A3C957] font-semibold">
                เลือกแล้ว {selectedUsers.length} รายการ
              </span>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleBulkApprove}
                  className="rounded-xl bg-gradient-to-r from-[#81B214] to-[#50B003] text-white font-bold shadow hover:from-[#A3C957] hover:to-[#81B214]"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  อนุมัติทั้งหมด
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkReject}
                  className="rounded-xl font-bold shadow"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  ปฏิเสธทั้งหมด
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUsers([])}
                  className="rounded-xl"
                >
                  ยกเลิก
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
            {/* Bulk Actions for All Pending Users */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleApproveAll}
                className="rounded-xl bg-gradient-to-r from-[#81B214] to-[#50B003] text-white font-bold shadow hover:from-[#A3C957] hover:to-[#81B214]"
                disabled={
                  filteredUsers.filter(
                    (user) => user.status === "PENDING_APPROVAL",
                  ).length === 0
                }
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                อนุมัติทั้งหมด (
                {
                  filteredUsers.filter(
                    (user) => user.status === "PENDING_APPROVAL",
                  ).length
                }
                )
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRejectAll}
                className="rounded-xl font-bold shadow"
                disabled={
                  filteredUsers.filter(
                    (user) => user.status === "PENDING_APPROVAL",
                  ).length === 0
                }
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                ปฏิเสธทั้งหมด (
                {
                  filteredUsers.filter(
                    (user) => user.status === "PENDING_APPROVAL",
                  ).length
                }
                )
              </Button>
            </div>

            {/* Clear Filters */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterRole("all");
                setFilterStatus("all");
              }}
              className="rounded-xl border-[#A3C957] dark:border-[#81B214] text-[#81B214] dark:text-[#A3C957] font-semibold hover:bg-[#E2F9B8]/60 dark:hover:bg-[#A3C957]/20 bg-white/80 dark:bg-gray-800/80 shadow"
            >
              <Filter className="mr-1.5 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Card Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="dark:bg-gray-900/80 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              {/* Card Header — Avatar + Name + Action */}
              <div className="flex items-start justify-between p-4 pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.image || "/placeholder-user.jpg"}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover shrink-0 border-2 border-[#A3C957]/40"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {user.name || "—"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                {/* Action Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 shrink-0 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="dark:bg-gray-900/80 dark:border-gray-700"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        setActionDialog({ open: true, type: "details", user })
                      }
                      className="dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      ดูรายละเอียด
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    {user.status !== "APPROVED" && (
                      <DropdownMenuItem
                        onClick={() =>
                          setActionDialog({ open: true, type: "approve", user })
                        }
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                        อนุมัติ
                      </DropdownMenuItem>
                    )}
                    {user.status !== "REJECTED" && (
                      <DropdownMenuItem
                        onClick={() =>
                          setActionDialog({ open: true, type: "reject", user })
                        }
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                        ปฏิเสธ
                      </DropdownMenuItem>
                    )}
                    {user.status !== "SUSPENDED" && (
                      <DropdownMenuItem
                        onClick={() =>
                          setActionDialog({ open: true, type: "suspend", user })
                        }
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <Ban className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                        ระงับ
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    {user.role === "alumni" && (
                      <DropdownMenuItem
                        onClick={() =>
                          setActionDialog({
                            open: true,
                            type: "role",
                            user,
                            newRole: "admin",
                          })
                        }
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        เปลี่ยนเป็น Admin
                      </DropdownMenuItem>
                    )}
                    {user.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() =>
                          setActionDialog({
                            open: true,
                            type: "role",
                            user,
                            newRole: "alumni",
                          })
                        }
                        className="dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        เปลี่ยนเป็น ศิษย์เก่า
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                      onClick={() =>
                        setActionDialog({ open: true, type: "delete", user })
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบผู้ใช้
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
                <Badge
                  variant="secondary"
                  className={
                    user.role === "admin"
                      ? "text-orange-700 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300"
                      : "text-purple-700 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300"
                  }
                >
                  {user.role === "admin" ? "ผู้ดูแลระบบ" : "ศิษย์เก่า"}
                </Badge>
                <div className="flex items-center gap-1">
                  <Badge className={getStatusBadgeVariant(user.status)}>
                    {getStatusIcon(user.status)}
                    {user.status === "PENDING_APPROVAL" && "รออนุมัติ"}
                    {user.status === "APPROVED" && "อนุมัติแล้ว"}
                    {user.status === "REJECTED" && "ถูกปฏิเสธ"}
                    {user.status === "SUSPENDED" && "ถูกระงับ"}
                    {user.status === "UNREGISTERED" && "ยังไม่ได้ลงทะเบียน"}
                  </Badge>
                </div>
              </div>

              {/* Alumni Profile Info */}
              <CardContent className="px-4 pt-3 pb-4">
                {user.alumni_profiles.length > 0 ? (
                  <div className="space-y-1">
                    {user.alumni_profiles.map((profile: any) => (
                      <div
                        key={profile.id}
                        className="text-sm bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="font-medium text-gray-700 dark:text-gray-200 truncate">
                          {profile.programname}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {profile.studentcode} · รุ่นที่{" "}
                          {AdmitYear(profile.admit_year)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    ไม่มีข้อมูลศิษย์เก่า
                  </p>
                )}

                {/* Footer — Date */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>วันที่สร้าง</span>
                  <span>
                    {new Date(user.created_at).toLocaleDateString("th-TH")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="dark:bg-gray-900/80 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-base font-medium">
              ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open: boolean) => {
          if (!open) {
            // Clear dialog state completely when closing
            setActionDialog({ open: false, type: "details", user: undefined });
            // Force clear pointer-events from body
            setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 100);
          }
        }}
      >
        <DialogContent className="dark:bg-gray-900/80 dark:border-gray-700 w-[calc(100%-2rem)] max-w-lg sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-200">
              {actionDialog.type === "details" && "รายละเอียดผู้ใช้"}
              {actionDialog.type === "approve" && "ยืนยันการอนุมัติ"}
              {actionDialog.type === "reject" && "ยืนยันการปฏิเสธ"}
              {actionDialog.type === "suspend" && "ยืนยันการระงับ"}
              {actionDialog.type === "delete" && "ยืนยันการลบ"}
              {actionDialog.type === "role" && "ยืนยันการเปลี่ยนบทบาท"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400 break-words">
              {actionDialog.type === "details" &&
                `แสดงรายละเอียดของ ${actionDialog.user?.email}`}
              {actionDialog.type === "approve" &&
                `คุณต้องการอนุมัติบัญชี ${actionDialog.user?.email} หรือไม่?`}
              {actionDialog.type === "reject" &&
                `คุณต้องการปฏิเสธบัญชี ${actionDialog.user?.email} หรือไม่?`}
              {actionDialog.type === "suspend" &&
                `คุณต้องการระงับบัญชี ${actionDialog.user?.email} หรือไม่?`}
              {actionDialog.type === "delete" &&
                `คุณต้องการลบบัญชี ${actionDialog.user?.email} หรือไม่? การดำเนินการนี้ไม่สามารถกู้คืนได้`}
              {actionDialog.type === "role" &&
                `คุณต้องการเปลี่ยนบทบาทของ ${actionDialog.user?.email} เป็น ${
                  actionDialog.newRole === "admin" ? "ผู้ดูแลระบบ" : "ศิษย์เก่า"
                } หรือไม่?`}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.type === "details" && actionDialog.user && (
            <div className="space-y-4 dark:text-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    อีเมล
                  </label>
                  <p className="text-sm">{actionDialog.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    บทบาท
                  </label>
                  <p className="text-sm">
                    {actionDialog.user.role === "admin"
                      ? "ผู้ดูแลระบบ"
                      : "ศิษย์เก่า"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    สถานะ
                  </label>
                  <p className="text-sm">
                    {actionDialog.user.status === "PENDING_APPROVAL" &&
                      "รออนุมัติ"}
                    {actionDialog.user.status === "APPROVED" && "อนุมัติแล้ว"}
                    {actionDialog.user.status === "REJECTED" && "ถูกปฏิเสธ"}
                    {actionDialog.user.status === "SUSPENDED" && "ถูกระงับ"}
                    {actionDialog.user.status === "UNREGISTERED" &&
                      "ยังไม่ได้ลงทะเบียน"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    วันที่สร้าง
                  </label>
                  <p className="text-sm">
                    {new Date(actionDialog.user.created_at).toLocaleDateString(
                      "th-TH",
                    )}
                  </p>
                </div>
              </div>
              {actionDialog.user.username && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    ชื่อผู้ใช้
                  </label>
                  <p className="text-sm">{actionDialog.user.username}</p>
                </div>
              )}
              {actionDialog.user.name && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    ชื่อ-นามสกุล
                  </label>
                  <p className="text-sm">{actionDialog.user.name}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            {actionDialog.type === "details" ? (
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setActionDialog({
                    open: false,
                    type: "details",
                    user: undefined,
                  });
                  // Force clear pointer-events from body
                  setTimeout(() => {
                    document.body.style.pointerEvents = "";
                  }, 100);
                }}
              >
                ปิด
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setActionDialog({
                      open: false,
                      type: "details",
                      user: undefined,
                    });
                    // Force clear pointer-events from body
                    setTimeout(() => {
                      document.body.style.pointerEvents = "";
                    }, 100);
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant={
                    actionDialog.type === "delete" ? "destructive" : "default"
                  }
                  onClick={executeAction}
                  className={[
                    "w-full sm:w-auto",
                    actionDialog.type === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "",
                  ].join(" ")}
                >
                  {actionDialog.type === "approve" && "อนุมัติ"}
                  {actionDialog.type === "reject" && "ปฏิเสธ"}
                  {actionDialog.type === "suspend" && "ระงับ"}
                  {actionDialog.type === "delete" && "ลบ"}
                  {actionDialog.type === "role" && "เปลี่ยนบทบาท"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
