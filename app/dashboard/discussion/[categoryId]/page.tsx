"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MessageSquare, Calendar, User, Search, Pin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

interface DiscussionTopic {
  id: string;
  category_id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  replies_count: number;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  locked: boolean;
}

interface DiscussionCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

// Demo data for topics
const demoTopics: DiscussionTopic[] = [
  {
    id: "topic-1",
    category_id: "1", // General
    title: "แนะนำตัวศิษย์เก่าใหม่ครับ",
    content:
      "สวัสดีครับ ผมเป็นศิษย์เก่าใหม่ที่เพิ่งเข้ามาในระบบ อยากแนะนำตัวและทำความรู้จักกับทุกคนครับ",
    author: { name: "สมชาย ใจดี", email: "somchai@example.com" },
    replies_count: 5,
    created_at: "2024-07-20T10:00:00Z",
    updated_at: "2024-07-20T10:00:00Z",
    pinned: true,
    locked: false,
  },
  {
    id: "topic-2",
    category_id: "1", // General
    title: "สอบถามเรื่องการจัดงานคืนสู่เหย้าปีนี้",
    content:
      "มีใครพอทราบบ้างครับว่าปีนี้จะมีการจัดงานคืนสู่เหย้าเมื่อไหร่และที่ไหนครับ?",
    author: { name: "มาลี สวยงาม", email: "malee@example.com" },
    replies_count: 12,
    created_at: "2024-07-18T14:30:00Z",
    updated_at: "2024-07-18T14:30:00Z",
    pinned: false,
    locked: false,
  },
  {
    id: "topic-3",
    category_id: "2", // Job Seeking
    title: "แชร์ประสบการณ์สัมภาษณ์งาน Software Engineer ที่บริษัท TechX",
    content:
      "ผมเพิ่งไปสัมภาษณ์งานที่ TechX มาครับ อยากมาแชร์ประสบการณ์เผื่อเป็นประโยชน์กับคนอื่นๆ",
    author: { name: "กมล ทำดี", email: "kamon@example.com" },
    replies_count: 8,
    created_at: "2024-07-15T09:00:00Z",
    updated_at: "2024-07-15T09:00:00Z",
    pinned: false,
    locked: false,
  },
  {
    id: "topic-4",
    category_id: "3", // Technology
    title: "Blockchain กับอนาคตของ Web3",
    content:
      "มาคุยกันเรื่องเทคโนโลยี Blockchain และแนวโน้มของ Web3 ในอนาคตครับ",
    author: { name: "สมศักดิ์ เก่งมาก", email: "somsak@example.com" },
    replies_count: 20,
    created_at: "2024-07-10T11:00:00Z",
    updated_at: "2024-07-10T11:00:00Z",
    pinned: false,
    locked: false,
  },
  {
    id: "topic-5",
    category_id: "1", // General
    title: "หาเพื่อนร่วมทีมทำโปรเจกต์ Startup",
    content:
      "กำลังมองหาเพื่อนร่วมทีมที่มีความสนใจในการสร้าง Startup ด้าน AI ครับ",
    author: { name: "พรชัย มีสุข", email: "pornchai@example.com" },
    replies_count: 3,
    created_at: "2024-07-05T16:00:00Z",
    updated_at: "2024-07-05T16:00:00Z",
    pinned: false,
    locked: false,
  },
];

// Demo data for categories (to get category name)
const demoCategories: DiscussionCategory[] = [
  {
    id: "1",
    name: "ทั่วไป",
    description: "หัวข้อสนทนาทั่วไปสำหรับศิษย์เก่า",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "หางาน",
    description: "แชร์ข้อมูลการหางานและโอกาสทางอาชีพ",
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "3",
    name: "เทคโนโลยี",
    description: "อัปเดตเทคโนโลยีและแนวโน้มใหม่ๆ",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "4",
    name: "กิจกรรม",
    description: "ประชาสัมพันธ์กิจกรรมและงานสังสรรค์",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "5",
    name: "คำถาม-คำตอบ",
    description: "ถาม-ตอบปัญหาต่างๆ",
    created_at: "2024-01-20T00:00:00Z",
  },
];

export default function CategoryTopicsPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const [topics, setTopics] = useState<DiscussionTopic[]>([]);
  const [category, setCategory] = useState<DiscussionCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initializePage = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const foundCategory = demoCategories.find((cat) => cat.id === categoryId);
      setCategory(foundCategory || null);

      const filteredTopics = demoTopics.filter(
        (topic) => topic.category_id === categoryId
      );
      setTopics(filteredTopics);
      setLoading(false);
    };
    initializePage();
  }, [categoryId]);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>{" "}
          {/* Placeholder for category title */}
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>{" "}
          {/* Placeholder for category description */}
          <div className="relative mb-6">
            <div className="h-10 bg-gray-200 rounded-lg"></div>{" "}
            {/* Placeholder for search input */}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10 shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold text-red-600">
            ไม่พบหมวดหมู่
          </CardTitle>
          <CardDescription className="text-gray-600">
            หมวดหมู่ที่คุณค้นหาไม่พบในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Link href="/dashboard/discussion">
            <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
              กลับสู่เว็บบอร์ด
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {category.name}
        </h1>
        <p className="text-lg text-gray-600">{category.description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ค้นหากระทู้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg focus-visible:ring-blue-500"
          />
        </div>
        {user && ( // Only show "Create New Topic" if user is logged in
          <Link href={`/dashboard/discussion/${categoryId}/new`}>
            {" "}
            {/* Link to new topic page */}
            <Button className="w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              สร้างกระทู้ใหม่
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/dashboard/discussion/${categoryId}/${topic.id}`}
            >
              <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1.5 flex items-center">
                        {topic.pinned && (
                          <Pin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        )}
                        {topic.title}
                      </h3>
                      <p className="text-gray-700 line-clamp-2 text-base leading-relaxed">
                        {topic.content}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MessageSquare className="mr-1.5 h-4 w-4 text-gray-400" />
                        {topic.replies_count}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      {topic.author.name}
                    </span>
                    <Calendar className="ml-4 mr-2 h-4 w-4 text-gray-400" />
                    {new Date(topic.created_at).toLocaleDateString("th-TH")}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="shadow-md rounded-xl">
            <CardContent className="p-12 text-center">
              <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ไม่พบกระทู้ในหมวดหมู่นี้
              </h3>
              <p className="text-gray-600 text-base">
                ลองเปลี่ยนคำค้นหา หรือสร้างกระทู้ใหม่
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
