"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Newspaper,
  Plus,
  Search,
  MessageCircle,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
// Removed: import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  published: boolean;
  created_at: string;
  updated_at: string;
  comments_count: number;
}

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  created_at: string;
}

// isDemoMode is now always true as we are using mock data
const isDemoMode = true;

// Demo data
const demoNews: NewsItem[] = [
  {
    id: "1",
    title: "ประกาศการจัดงานสังสรรค์ศิษย์เก่าประจำปี 2024",
    content:
      "เรียนศิษย์เก่าทุกท่าน\n\nขอเชิญร่วมงานสังสรรค์ศิษย์เก่าประจำปี 2024 ในวันเสาร์ที่ 15 มิถุนายน 2024 เวลา 18:00 น. ณ โรงแรมแกรนด์ ไฮแอท เอราวัณ กรุงเทพฯ\n\nกิจกรรมภายในงาน:\n- พิธีเปิดงานและการแสดงจากนักศึกษาปัจจุบัน\n- งานเลี้ยงสังสรรค์และการแลกเปลี่ยนประสบการณ์\n- การมอบรางวัลศิษย์เก่าดีเด่น\n- การจับรางวัลใหญ่\n\nค่าบัตรเข้างาน 1,500 บาทต่อท่าน (รวมอาหารและเครื่องดื่ม)\n\nสนใจสมัครได้ที่เว็บไซต์หรือติดต่อสำนักงานศิษย์เก่า",
    author: {
      name: "ผู้ดูแลระบบ",
      email: "admin@example.com",
    },
    published: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    comments_count: 12,
  },
  {
    id: "2",
    title: "เปิดรับสมัครทุนการศึกษาสำหรับบุตรศิษย์เก่า",
    content:
      "สมาคมศิษย์เก่าขอประกาศเปิดรับสมัครทุนการศึกษาสำหรับบุตรศิษย์เก่า ประจำปีการศึกษา 2567\n\nเงื่อนไข:\n- เป็นบุตรของศิษย์เก่าที่เป็นสมาชิกสมาคม\n- มีผลการเรียนเฉลี่ยไม่ต่ำกว่า 3.00\n- มีความประพฤติดี\n- ครอบครัวมีรายได้ไม่เกิน 30,000 บาทต่อเดือน\n\nจำนวนทุน: 20 ทุน ๆ ละ 20,000 บาท\n\nกำหนดส่งใบสมัคร: 31 มีนาคม 2567\n\nดาวน์โหลดใบสมัครได้ที่เว็บไซต์สมาคมศิษย์เก่า",
    author: {
      name: "ผู้ดูแลระบบ",
      email: "admin@example.com",
    },
    published: true,
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    comments_count: 8,
  },
  {
    id: "3",
    title: "ผลการประชุมคณะกรรมการสมาคมศิษย์เก่า ครั้งที่ 1/2567",
    content:
      "สรุปผลการประชุมคณะกรรมการสมาคมศิษย์เก่า เรื่องแผนงานประจำปี 2567 และการเตรียมงานสำหรับกิจกรรมในอนาคต",
    author: {
      name: "ผู้ดูแลระบบ",
      email: "admin@example.com",
    },
    published: true,
    created_at: "2024-01-05T09:00:00Z",
    updated_at: "2024-01-05T09:00:00Z",
    comments_count: 3,
  },
];

// Demo comments for news item 1
const demoCommentsNews1: Comment[] = [
  {
    id: "1",
    content: "ขอบคุณสำหรับข้อมูลครับ รอไปงานแน่นอน!",
    author: { name: "สมชาย ใจดี", email: "somchai@example.com" },
    created_at: "2024-01-16T09:00:00Z",
  },
  {
    id: "2",
    content: "สนใจมากเลยค่ะ จะไปร่วมงานแน่นอน",
    author: { name: "มาลี สวยงาม", email: "malee@example.com" },
    created_at: "2024-01-16T10:30:00Z",
  },
  {
    id: "3",
    content: "งานจัดที่ไหนครับ?",
    author: { name: "กมล ทำดี", email: "kamon@example.com" },
    created_at: "2024-01-16T11:00:00Z",
  },
];

// Demo comments for news item 2
const demoCommentsNews2: Comment[] = [
  {
    id: "4",
    content: "ดีจังเลยค่ะ มีทุนการศึกษาให้บุตรหลานด้วย",
    author: { name: "สมศักดิ์ เก่งมาก", email: "somsak@example.com" },
    created_at: "2024-01-11T10:00:00Z",
  },
  {
    id: "5",
    content: "เงื่อนไขชัดเจนดีครับ",
    author: { name: "พรชัย มีสุข", email: "pornchai@example.com" },
    created_at: "2024-01-11T11:00:00Z",
  },
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // Start loading to simulate fetch
  const [user, setUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initializePage = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setNews(demoNews);
      setLoading(false);
    };
    initializePage();
  }, []);

  const handleNewsClick = async (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate comment fetching delay

    // Assign demo comments based on news item ID
    if (newsItem.id === "1") {
      setComments(demoCommentsNews1);
    } else if (newsItem.id === "2") {
      setComments(demoCommentsNews2);
    } else {
      setComments([]); // No comments for other demo news
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate comment submission delay

    const demoComment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: { name: user.email.split("@")[0], email: user.email }, // Use current demo user's email for author
      created_at: new Date().toISOString(),
    };
    setComments([...comments, demoComment]);
    setNewComment("");
    // Update comments_count for the selected news item in demoNews
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.id === selectedNews?.id
          ? { ...item, comments_count: item.comments_count + 1 }
          : item
      )
    );
    if (selectedNews) {
      setSelectedNews((prev) =>
        prev ? { ...prev, comments_count: prev.comments_count + 1 } : null
      );
    }
  };

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>{" "}
          {/* Larger placeholder for title */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {" "}
      {/* Increased overall spacing */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">ข่าวสาร</h1>{" "}
          {/* Bolder title */}
          <p className="text-lg text-gray-600">
            ข่าวประชาสัมพันธ์และกิจกรรมต่างๆ (ข้อมูลตัวอย่าง)
          </p>{" "}
          {/* Larger text */}
        </div>
        {user?.role === "admin" && (
          <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
            {" "}
            {/* Rounded button */}
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มข่าวใหม่
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />{" "}
            {/* Centered icon */}
            <Input
              placeholder="ค้นหาข่าว..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg focus-visible:ring-blue-500"
            />
          </div>

          {/* News Items */}
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className={`cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 rounded-xl ${
                  /* Enhanced shadow and hover */
                  selectedNews?.id === item.id
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "" /* Enhanced selected state */
                }`}
                onClick={() => handleNewsClick(item)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      {" "}
                      {/* Added right padding */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2\">
                        {item.title}
                      </h3>{" "}
                      {/* Larger, bolder title */}\
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        {" "}
                        {/* Added flex-wrap and gap */}
                        <div className="flex items-center">
                          <Edit className="mr-1.5 h-4 w-4 text-gray-400" />{" "}
                          {/* Adjusted spacing, added text color to icon */}
                          {item.author.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />{" "}
                          {/* Adjusted spacing, added text color to icon */}
                          {new Date(item.created_at).toLocaleDateString(
                            "th-TH"
                          )}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="mr-1.5 h-4 w-4 text-gray-400" />{" "}
                          {/* Adjusted spacing, added text color to icon */}
                          {item.comments_count} ความคิดเห็น
                        </div>
                      </div>
                    </div>
                    {user?.role === "admin" && (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-gray-100"
                        >
                          {" "}
                          {/* Changed to icon size, rounded */}
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-gray-100 text-red-500 hover:text-red-600"
                        >
                          {" "}
                          {/* Changed to icon size, rounded, added red color */}
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 line-clamp-3 leading-relaxed">
                    {item.content.substring(0, 200)}...
                  </p>{" "}
                  {/* Adjusted text color and line height */}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <Card className="shadow-md rounded-xl">
              {" "}
              {/* Added shadow and rounded corners */}
              <CardContent className="p-12 text-center">
                <Newspaper className="mx-auto h-16 w-16 text-gray-400 mb-6" />{" "}
                {/* Larger icon, increased spacing */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ไม่พบข่าวสาร
                </h3>{" "}
                {/* Larger, bolder title */}
                <p className="text-gray-600 text-base">
                  ลองเปลี่ยนคำค้นหา
                </p>{" "}
                {/* Larger text */}
              </CardContent>
            </Card>
          )}
        </div>

        {/* News Detail & Comments */}
        <div className="space-y-6">
          {selectedNews ? (
            <>
              <Card className="shadow-md rounded-xl">
                {" "}
                {/* Added shadow and rounded corners */}
                <CardHeader className="pb-4">
                  {" "}
                  {/* Adjusted padding */}
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {selectedNews.title}
                  </CardTitle>{" "}
                  {/* Larger, bolder title */}
                  <CardDescription className="text-gray-600">
                    โดย {selectedNews.author.name} •{" "}
                    {new Date(selectedNews.created_at).toLocaleDateString(
                      "th-TH"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {" "}
                  {/* Adjusted padding */}
                  <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                    {" "}
                    {/* Adjusted text color and line height */}
                    {selectedNews.content
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-3">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card className="shadow-md rounded-xl">
                {" "}
                {/* Added shadow and rounded corners */}
                <CardHeader className="pb-4">
                  {" "}
                  {/* Adjusted padding */}
                  <CardTitle className="flex items-center text-xl font-semibold">
                    {" "}
                    {/* Larger, bolder title */}
                    <MessageCircle className="mr-2 h-5 w-5 text-blue-600" />{" "}
                    {/* Added text color to icon */}
                    ความคิดเห็น ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {" "}
                  {/* Increased spacing */}
                  {/* Add Comment */}
                  {user && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="แสดงความคิดเห็น..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        className="rounded-lg focus-visible:ring-blue-500"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        {" "}
                        {/* Rounded button */}
                        ส่งความคิดเห็น
                      </Button>
                    </div>
                  )}
                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-9 w-9">
                          {" "}
                          {/* Slightly larger avatar */}
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
                            {" "}
                            {/* Adjusted text size */}
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                            {" "}
                            {/* Enhanced comment bubble styling */}
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-800">
                                {comment.author.name}
                              </span>{" "}
                              {/* Bolder text */}
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString("th-TH")}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>{" "}
                            {/* Adjusted text color and line height */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />{" "}
                      {/* Larger icon, increased spacing */}
                      <p className="text-base">ยังไม่มีความคิดเห็น</p>{" "}
                      {/* Larger text */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-md rounded-xl\">
              {" "}
              {/* Added shadow and rounded corners */}
              <CardContent className="p-12 text-center">
                <Newspaper className="mx-auto h-16 w-16 text-gray-400 mb-6" />{" "}
                {/* Larger icon, increased spacing */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  เลือกข่าวที่ต้องการอ่าน
                </h3>{" "}
                {/* Larger, bolder title */}
                <p className="text-gray-600 text-base">
                  คลิกที่ข่าวในรายการเพื่อดูรายละเอียดและความคิดเห็น
                </p>{" "}
                {/* Larger text */}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
