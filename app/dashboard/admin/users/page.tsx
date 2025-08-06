"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"

// Extend the User interface for admin view
interface AdminUser extends User {
  national_id?: string
  birth_date?: string
  created_at: string
}

// Demo data for users
const demoUsers: AdminUser[] = [
  {
    id: "admin-user",
    email: "admin@example.com",
    role: "admin",
    status: "APPROVED",
    national_id: "1111111111111",
    birth_date: "1990-01-01",
    created_at: "2023-01-01T10:00:00Z",
  },
  {
    id: "alumni-user",
    email: "alumni@example.com",
    role: "alumni",
    status: "APPROVED",
    national_id: "2222222222222",
    birth_date: "1992-05-15",
    created_at: "2023-02-01T11:00:00Z",
  },
  {
    id: "pending-user",
    email: "pending@example.com",
    role: "alumni",
    status: "PENDING_APPROVAL",
    national_id: "3333333333333",
    birth_date: "1995-08-20",
    created_at: "2023-03-01T12:00:00Z",
  },
  {
    id: "rejected-user",
    email: "rejected@example.com",
    role: "alumni",
    status: "REJECTED",
    national_id: "4444444444444",
    birth_date: "1991-11-10",
    created_at: "2023-04-01T13:00:00Z",
  },
  {
    id: "suspended-user",
    email: "suspended@example.com",
    role: "alumni",
    status: "SUSPENDED",
    national_id: "5555555555555",
    birth_date: "1988-03-25",
    created_at: "2023-05-01T14:00:00Z",
  },
  {
    id: "new-alumni-1",
    email: "new.alumni1@example.com",
    role: "alumni",
    status: "APPROVED",
    national_id: "6666666666666",
    birth_date: "1993-07-07",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "new-alumni-2",
    email: "new.alumni2@example.com",
    role: "alumni",
    status: "PENDING_APPROVAL",
    national_id: "7777777777777",
    birth_date: "1996-02-14",
    created_at: "2024-01-12T15:00:00Z",
  },
]

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "alumni">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SUSPENDED">(
    "all",
  )
  const router = useRouter()

  useEffect(() => {
    const initializePage = async () => {
      const user = await getCurrentUser()
      if (!user || user.role !== "admin") {
        // Redirect if not admin
        router.push("/dashboard") // Or to a specific access denied page
        return
      }
      setCurrentUser(user)

      // Simulate fetching users
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers(demoUsers)
      setLoading(false)
    }
    initializePage()
  }, [router])

  const handleUpdateUser = (userId: string, updates: Partial<AdminUser>) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updates } : user)))
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.national_id?.includes(searchTerm) ||
      user.birth_date?.includes(searchTerm)

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">ไม่ได้รับอนุญาต</CardTitle>
          <CardDescription>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => router.push("/dashboard")}>กลับสู่แดชบอร์ด</Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadgeVariant = (status: AdminUser["status"]) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING_APPROVAL":
        return "secondary"
      case "REJECTED":
        return "destructive"
      case "SUSPENDED":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: AdminUser["status"]) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "PENDING_APPROVAL":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "SUSPENDED":
        return <Ban className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
        <p className="text-gray-600">รายชื่อผู้ใช้ทั้งหมดในระบบ (ข้อมูลตัวอย่าง)</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาอีเมล, เลขบัตรประชาชน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={(value: "all" | "admin" | "alumni") => setFilterRole(value)}>
              <SelectTrigger>
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
              onValueChange={(value: "all" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SUSPENDED") =>
                setFilterStatus(value)
              }
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
          <div className="mt-4 text-right">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterRole("all")
                setFilterStatus("all")
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="hidden md:table-cell">เลขบัตรประชาชน</TableHead>
                <TableHead className="hidden md:table-cell">วันเกิด</TableHead>
                <TableHead className="hidden lg:table-cell">วันที่สร้าง</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role === "admin" ? "ผู้ดูแลระบบ" : "ศิษย์เก่า"}</Badge>
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
                    <TableCell className="hidden md:table-cell">{user.national_id || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.birth_date || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert(`ดูรายละเอียด ${user.email}`)}>
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status !== "APPROVED" && (
                            <DropdownMenuItem onClick={() => handleUpdateUser(user.id, { status: "APPROVED" })}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> อนุมัติ
                            </DropdownMenuItem>
                          )}
                          {user.status !== "PENDING_APPROVAL" && user.status !== "REJECTED" && (
                            <DropdownMenuItem onClick={() => handleUpdateUser(user.id, { status: "PENDING_APPROVAL" })}>
                              <Clock className="mr-2 h-4 w-4 text-yellow-600" /> ตั้งค่าเป็นรออนุมัติ
                            </DropdownMenuItem>
                          )}
                          {user.status !== "REJECTED" && (
                            <DropdownMenuItem onClick={() => handleUpdateUser(user.id, { status: "REJECTED" })}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" /> ปฏิเสธ
                            </DropdownMenuItem>
                          )}
                          {user.status !== "SUSPENDED" && (
                            <DropdownMenuItem onClick={() => handleUpdateUser(user.id, { status: "SUSPENDED" })}>
                              <Ban className="mr-2 h-4 w-4 text-gray-600" /> ระงับ
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {user.role === "alumni" && (
                            <DropdownMenuItem onClick={() => handleUpdateUser(user.id, { role: "admin" })}>
                              <UserCheck className="mr-2 h-4 w-4" /> เปลี่ยนเป็น Admin
                            </DropdownMenuItem>
                          )}
                          {user.role === "admin" && (
                            <DropdownMenuItem onClick={() => handleUpdateUser(user.id, { role: "alumni" })}>
                              <UserX className="mr-2 h-4 w-4" /> เปลี่ยนเป็น ศิษย์เก่า
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> ลบผู้ใช้
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
