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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useSession } from "next-auth/react";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "alumni">(
    "all"
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
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      if (!session || session.user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
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
  }, [router, session]);

  const handleUpdateUser = (userId: string, updates: Partial<any>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    }
  };

  // Bulk operations
  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleBulkApprove = () => {
    if (
      selectedUsers.length > 0 &&
      confirm(`อนุมัติผู้ใช้ ${selectedUsers.length} คน?`)
    ) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "APPROVED" as const }
            : user
        )
      );
      setSelectedUsers([]);
    }
  };

  const handleBulkReject = () => {
    if (
      selectedUsers.length > 0 &&
      confirm(`ปฏิเสธผู้ใช้ ${selectedUsers.length} คน?`)
    ) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "REJECTED" as const }
            : user
        )
      );
      setSelectedUsers([]);
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

  if (!session || session.user.role !== "admin") {
    return (
      <Card className="w-full max-w-md mx-auto mt-10 dark:bg-gray-900/80 dark:border-gray-700 p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            ไม่ได้รับอนุญาต
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => router.push("/dashboard")}>
            กลับสู่แดชบอร์ด
          </Button>
        </CardContent>
      </Card>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#81B214]">
          จัดการบัญชีศิษย์เก่า
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ยืนยันและจัดการบัญชีศิษย์เก่าที่ลงทะเบียนใหม่
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      (u) => u.status === "APPROVED" && u.role === "alumni"
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
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-[#81B214] dark:text-[#A3C957]" />
              <Input
                placeholder="ค้นหาอีเมล, ชื่อ..."
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
                  | "SUSPENDED"
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
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[#E2F9B8] via-[#F6FFDE] to-[#A3C957]/40 dark:from-[#A3C957]/20 dark:via-[#F6FFDE]/10 dark:to-[#81B214]/10 border border-[#A3C957] dark:border-[#81B214] rounded-2xl mt-6 shadow-sm">
              <span className="text-sm text-[#81B214] dark:text-[#A3C957] font-semibold">
                เลือกแล้ว {selectedUsers.length} รายการ
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleBulkApprove}
                  className="rounded-xl bg-gradient-to-r from-[#81B214] to-[#50B003] text-white font-bold shadow hover:from-[#A3C957] hover:to-[#81B214]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  อนุมัติทั้งหมด
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkReject}
                  className="rounded-xl font-bold shadow"
                >
                  <XCircle className="w-4 h-4 mr-2" />
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

          <div className="mt-6 text-right">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterRole("all");
                setFilterStatus("all");
              }}
              className="rounded-xl border-[#A3C957] dark:border-[#81B214] text-[#81B214] dark:text-[#A3C957] font-semibold hover:bg-[#E2F9B8]/60 dark:hover:bg-[#A3C957]/20 bg-white/80 dark:bg-gray-800/80 shadow"
            >
              <Filter className="mr-2 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="dark:bg-gray-900/80 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="w-12 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </TableHead>
                <TableHead className="dark:text-gray-300">อีเมล</TableHead>
                <TableHead className="dark:text-gray-300">บทบาท</TableHead>
                <TableHead className="dark:text-gray-300">สถานะ</TableHead>

                <TableHead className="hidden lg:table-cell dark:text-gray-300">
                  วันที่สร้าง
                </TableHead>
                <TableHead className="text-right dark:text-gray-300">
                  การดำเนินการ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="dark:border-gray-700">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </TableCell>
                    <TableCell className="font-medium dark:text-gray-200">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="dark:bg-gray-700 dark:text-gray-200"
                      >
                        {user.role === "admin" ? "ผู้ดูแลระบบ" : "ศิษย์เก่า"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <Badge className={getStatusBadgeVariant(user.status)}>
                          {user.status === "PENDING_APPROVAL" && "รออนุมัติ"}
                          {user.status === "APPROVED" && "อนุมัติแล้ว"}
                          {user.status === "REJECTED" && "ถูกปฏิเสธ"}
                          {user.status === "SUSPENDED" && "ถูกระงับ"}
                          {user.status === "UNREGISTERED" &&
                            "ยังไม่ได้ลงทะเบียน"}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell dark:text-gray-300">
                      {new Date(user.created_at).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 dark:hover:bg-gray-700"
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
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                alert(`ดูรายละเอียด ${user.email}`);
                              }
                            }}
                            className="dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="dark:bg-gray-700" />
                          {user.status !== "APPROVED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUser(user.id, {
                                  status: "APPROVED",
                                })
                              }
                              className="dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />{" "}
                              อนุมัติ
                            </DropdownMenuItem>
                          )}
                          {user.status !== "PENDING_APPROVAL" &&
                            user.status !== "REJECTED" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateUser(user.id, {
                                    status: "PENDING_APPROVAL",
                                  })
                                }
                                className="dark:text-gray-200 dark:hover:bg-gray-700"
                              >
                                <Clock className="mr-2 h-4 w-4 text-yellow-600 dark:text-yellow-400" />{" "}
                                ตั้งค่าเป็นรออนุมัติ
                              </DropdownMenuItem>
                            )}
                          {user.status !== "REJECTED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUser(user.id, {
                                  status: "REJECTED",
                                })
                              }
                              className="dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />{" "}
                              ปฏิเสธ
                            </DropdownMenuItem>
                          )}
                          {user.status !== "SUSPENDED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUser(user.id, {
                                  status: "SUSPENDED",
                                })
                              }
                              className="dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <Ban className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />{" "}
                              ระงับ
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="dark:bg-gray-700" />
                          {user.role === "alumni" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUser(user.id, { role: "admin" })
                              }
                              className="dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <UserCheck className="mr-2 h-4 w-4" /> เปลี่ยนเป็น
                              Admin
                            </DropdownMenuItem>
                          )}
                          {user.role === "admin" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUser(user.id, { role: "alumni" })
                              }
                              className="dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <UserX className="mr-2 h-4 w-4" /> เปลี่ยนเป็น
                              ศิษย์เก่า
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="dark:bg-gray-700" />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> ลบผู้ใช้
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="dark:border-gray-700">
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
