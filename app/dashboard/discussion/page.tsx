"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Folder, Search } from "lucide-react";
// Removed: import { supabase, isSupabaseConfigured } from "../../../lib/supabase"
import { getCurrentUser } from "@/lib/auth";

interface DiscussionCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  topic_count?: number; // To store the count of topics in this category
}

// isDemoMode is now always true as we are using mock data
const isDemoMode = true;

// Demo data for categories
const demoCategories: DiscussionCategory[] = [
  {
    id: "1",
    name: "ทั่วไป",
    description: "หัวข้อสนทนาทั่วไปสำหรับศิษย์เก่า",
    created_at: "2024-01-01T00:00:00Z",
    topic_count: 15,
  },
  {
    id: "2",
    name: "หางาน",
    description: "แชร์ข้อมูลการหางานและโอกาสทางอาชีพ",
    created_at: "2024-01-05T00:00:00Z",
    topic_count: 8,
  },
  {
    id: "3",
    name: "เทคโนโลยี",
    description: "อัปเดตเทคโนโลยีและแนวโน้มใหม่ๆ",
    created_at: "2024-01-10T00:00:00Z",
    topic_count: 22,
  },
  {
    id: "4",
    name: "กิจกรรม",
    description: "ประชาสัมพันธ์กิจกรรมและงานสังสรรค์",
    created_at: "2024-01-15T00:00:00Z",
    topic_count: 5,
  },
  {
    id: "5",
    name: "คำถาม-คำตอบ",
    description: "ถาม-ตอบปัญหาต่างๆ",
    created_at: "2024-01-20T00:00:00Z",
    topic_count: 10,
  },
];

export default function DiscussionBoardPage() {
  const [categories, setCategories] = useState<DiscussionCategory[]>([]);
  const [loading, setLoading] = useState(true); // Start loading to simulate fetch
  const [user, setUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initializePage = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setCategories(demoCategories);
      setLoading(false);
    };
    initializePage();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            เว็บบอร์ดสนทนา
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            เลือกหมวดหมู่เพื่อดูหรือสร้างกระทู้ (ข้อมูลตัวอย่าง)
          </p>
        </div>
        {user?.role === "admin" && (
          <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มหมวดหมู่ใหม่
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="ค้นหาหมวดหมู่..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Link key={category.id} href={`/dashboard/discussion/${category.id}`}>
            <Card className="h-full hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center mb-4">
                  <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {category.name}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {category.description}
                </CardDescription>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {category.topic_count} กระทู้
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Folder className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              ไม่พบหมวดหมู่
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              ลองเปลี่ยนคำค้นหา
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
