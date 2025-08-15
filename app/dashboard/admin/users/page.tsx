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
} from "lucide-react";
import { getCurrentUser, type User } from "@/lib/auth";

// Extend the User interface for admin view
interface AdminUser extends User {
  national_id?: string;
  birth_date?: string;
  created_at: string;
}

// Demo data for users
const demoUsers: AdminUser[] = [
  {
    id: "admin-user",
    email: "admin@pharmacy.wu.ac.th",
    role: "admin",
    status: "APPROVED",
    national_id: "1111111111111",
    birth_date: "1990-01-01",
    created_at: "2023-01-01T10:00:00Z",
  },
  {
    id: "pharmacist-1",
    email: "somchai.jadee@gmail.com",
    role: "alumni",
    status: "APPROVED",
    national_id: "2222222222222",
    birth_date: "1992-05-15",
    created_at: "2023-02-01T11:00:00Z",
  },
  {
    id: "pending-pharmacist-1",
    email: "piyaporn.saijay@yahoo.com",
    role: "alumni",
    status: "PENDING_APPROVAL",
    national_id: "3333333333333",
    birth_date: "1995-08-20",
    created_at: "2024-08-01T12:00:00Z",
  },
  {
    id: "pending-pharmacist-2",
    email: "anan.rakrian@hotmail.com",
    role: "alumni",
    status: "PENDING_APPROVAL",
    national_id: "4444444444444",
    birth_date: "1991-11-10",
    created_at: "2024-08-05T13:00:00Z",
  },
  {
    id: "pending-pharmacist-3",
    email: "theerasak.tongdee@gmail.com",
    role: "alumni",
    status: "PENDING_APPROVAL",
    national_id: "5555555555555",
    birth_date: "1988-03-25",
    created_at: "2024-08-10T14:00:00Z",
  },
  {
    id: "rejected-pharmacist",
    email: "fake.account@email.com",
    role: "alumni",
    status: "REJECTED",
    national_id: "9999999999999",
    birth_date: "2000-01-01",
    created_at: "2024-07-15T14:00:00Z",
  },
  {
    id: "suspended-pharmacist",
    email: "suspended.user@email.com",
    role: "alumni",
    status: "SUSPENDED",
    national_id: "8888888888888",
    birth_date: "1985-12-25",
    created_at: "2023-12-01T14:00:00Z",
  },
];

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "alumni">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SUSPENDED"
  >("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      const user = await getCurrentUser();
      if (!user || user.role !== "admin") {
        // Redirect if not admin
        router.push("/dashboard"); // Or to a specific access denied page
        return;
      }
      setCurrentUser(user);

      // Simulate fetching users
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers(demoUsers);
      setLoading(false);
    };
    initializePage();
  }, [router]);

  const handleUpdateUser = (userId: string, updates: Partial<AdminUser>) => {
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

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Card className="w-full max-w-md mx-auto mt-10 dark:bg-gray-900/80 dark:border-gray-700">
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

  const getStatusBadgeVariant = (status: AdminUser["status"]) => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "PENDING_APPROVAL":
        return "secondary";
      case "REJECTED":
        return "destructive";
      case "SUSPENDED":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: AdminUser["status"]) => {
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          จัดการบัญชีเภสัชกรศิษย์เก่า
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ยืนยันและจัดการบัญชีเภสัชกรศิษย์เก่าที่ลงทะเบียนใหม่
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
      <Card className="dark:bg-gray-900/80 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="ค้นหาอีเมล, เลขบัตรประชาชน, ชื่อ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            <Select
              value={filterRole}
              onValueChange={(value: "all" | "admin" | "alumni") =>
                setFilterRole(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="กรองตามบทบาท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกบทบาท</SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                <SelectItem value="alumni">เภสัชกรศิษย์เก่า</SelectItem>
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
              <SelectTrigger>
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
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg mt-4">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                เลือกแล้ว {selectedUsers.length} รายการ
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkApprove}
                  className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  อนุมัติทั้งหมด
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkReject}
                  className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  ปฏิเสธทั้งหมด
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUsers([])}
                >
                  ยกเลิก
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-right">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterRole("all");
                setFilterStatus("all");
              }}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
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
                <TableHead className="hidden md:table-cell dark:text-gray-300">
                  เลขบัตรประชาชน
                </TableHead>
                <TableHead className="hidden md:table-cell dark:text-gray-300">
                  วันเกิด
                </TableHead>
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
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status === "PENDING_APPROVAL" && "รออนุมัติ"}
                          {user.status === "APPROVED" && "อนุมัติแล้ว"}
                          {user.status === "REJECTED" && "ถูกปฏิเสธ"}
                          {user.status === "SUSPENDED" && "ถูกระงับ"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell dark:text-gray-300">
                      {user.national_id || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell dark:text-gray-300">
                      {user.birth_date || "-"}
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
                              if (typeof window !== 'undefined') {
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
