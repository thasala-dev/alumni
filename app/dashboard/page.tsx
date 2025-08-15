"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import {
  Users,
  MapPin,
  Newspaper,
  MessageSquare,
  Heart,
  MessageCircle,
  Share,
  Camera,
  Send,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Clock,
  Loader2,
} from "lucide-react";

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    title: string;
    graduationYear: number;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Array<{
    id: number;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
  }>;
  isLiked: boolean;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  timestamp: string;
  category: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "เภสัชกร สมชาย ใจดี",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรโรงพยาบาล",
      graduationYear: 2018,
    },
    content:
      "วันนี้ได้เข้าร่วมการอบรมเรื่อง 'การจัดการยาต้านมะเร็งใหม่' ได้ความรู้ใหม่ๆ มากมาย! สำหรับน้องๆ เภสัชกรที่สนใจสาขานี้ แนะนำให้ติดตามข่าวสารจากสมาคมเภสัชกรรมโรงพยาบาลไทยนะครับ 💊✨",
    timestamp: "2 ชั่วโมงที่แล้ว",
    likes: 24,
    comments: [
      {
        id: 1,
        author: "เภสัชกร สมหญิง เก่งมาก",
        avatar: "/placeholder-user.jpg",
        content: "ขอบคุณสำหรับข้อมูลค่ะ! อยากเข้าร่วมการอบรมเหมือนกันเลย",
        timestamp: "1 ชั่วโมงที่แล้ว",
      },
      {
        id: 2,
        author: "เภสัชกร อนันต์ รักเรียน",
        avatar: "/placeholder-user.jpg",
        content: "สาขานี้น่าสนใจมากครับ! มีข้อมูลเพิ่มเติมไหมครับ",
        timestamp: "30 นาทีที่แล้ว",
      },
    ],
    isLiked: false,
  },
  {
    id: 2,
    author: {
      name: "เภสัชกร ปิยะพร สายใจ",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรชุมชน",
      graduationYear: 2016,
    },
    content:
      "เมื่อวานได้ไปให้ความรู้เรื่องการใช้ยาอย่างถูกต้องกับชาวบ้านในชุมชน รู้สึกมีความสุขมากที่ได้ใช้ความรู้ช่วยเหลือผู้คน การเป็นเภสัชกรชุมชนช่วยให้เราใกล้ชิดกับประชาชนและสามารถดูแลสุขภาพของทุกคนได้อย่างใกล้ชิด 🏥💚",
    image: "/placeholder.jpg",
    timestamp: "5 ชั่วโมงที่แล้ว",
    likes: 45,
    comments: [
      {
        id: 1,
        author: "เภสัชกร ธีรศักดิ์ ทองดี",
        avatar: "/placeholder-user.jpg",
        content:
          "ภาคภูมิใจในผลงานครับ! เป็นแรงบันดาลใจให้เพื่อนๆ เภสัชกรหลายคน",
        timestamp: "4 ชั่วโมงที่แล้ว",
      },
    ],
    isLiked: true,
  },
  {
    id: 3,
    author: {
      name: "เภสัชกร นิตยา สุขใส",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรผลิตภัณฑ์สมุนไพร",
      graduationYear: 2019,
    },
    content:
      "วันนี้ได้เข้าร่วมงาน Herbal Expo 2025 แล้ว! เจอนวัตกรรมสมุนไพรไทยใหม่ๆ มากมาย การพัฒนาผลิตภัณฑ์สมุนไพรที่มีมาตรฐานจะช่วยยกระดับอุตสาหกรรมสมุนไพรไทยสู่สากล 🌿🇹🇭",
    timestamp: "8 ชั่วโมงที่แล้ว",
    likes: 32,
    comments: [],
    isLiked: false,
  },
  {
    id: 4,
    author: {
      name: "เภสัชกร วิทยา เก่งกล้า",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรอุตสาหกรรม",
      graduationYear: 2017,
    },
    content:
      "เพิ่งจบการตรวจสอบ GMP ของโรงงานยา ภูมิใจที่ได้เป็นส่วนหนึ่งในการรับรองคุณภาพยาไทยให้ได้มาตรฐานสากล Quality Control คือหัวใจสำคัญของอุตสาหกรรมยา 🔬⚗️",
    timestamp: "12 ชั่วโมงที่แล้ว",
    likes: 28,
    comments: [
      {
        id: 1,
        author: "เภสัชกร อำพร วิจิตร",
        avatar: "/placeholder-user.jpg",
        content: "ขอบคุณสำหรับการทำงานที่ทุ่มเทครับ! GMP มีความสำคัญมากจริงๆ",
        timestamp: "11 ชั่วโมงที่แล้ว",
      },
    ],
    isLiked: true,
  },
  {
    id: 5,
    author: {
      name: "เภสัชกร สุรีย์ ศรีไทย",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรการค้า",
      graduationYear: 2020,
    },
    content:
      "เปิดร้านยาใหม่แล้วครับ! ตั้งใจจะให้บริการแบบ Patient Care อย่างเต็มรูปแบบ พร้อมให้คำปรึกษาเรื่องยาและสุขภาพอย่างใกล้ชิด ยินดีต้อนรับเพื่อนๆ เภสัชกร WU มาเยี่ยมชมครับ 🏪💊",
    image: "/placeholder.jpg",
    timestamp: "1 วันที่แล้ว",
    likes: 67,
    comments: [
      {
        id: 1,
        author: "เภสัชกร มาลี จันทร์เจ้า",
        avatar: "/placeholder-user.jpg",
        content: "ยินดีด้วยครับ! ขอให้ธุรกิจเจริญก้าวหน้านะครับ",
        timestamp: "23 ชั่วโมงที่แล้ว",
      },
      {
        id: 2,
        author: "เภสัชกร ดาริน ใสใหม่",
        avatar: "/placeholder-user.jpg",
        content: "เก่งมากเลยค่ะ! อยากไปเยี่ยมชมร้านจัง",
        timestamp: "20 ชั่วโมงที่แล้ว",
      },
    ],
    isLiked: false,
  },
  {
    id: 6,
    author: {
      name: "เภสัชกร ประยุทธ มั่นคง",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรทหาร",
      graduationYear: 2015,
    },
    content:
      "วันนี้ได้เข้าร่วมภารกิจช่วยเหลือชาวบ้านในพื้นที่ห่างไกล การได้นำความรู้เภสัชกรรมไปช่วยเหลือผู้คนที่ขาดแคลนการดูแลทางการแพทย์ ทำให้รู้สึกภูมิใจในอาชีพเภสัชกรมาก 🚁⛑️",
    timestamp: "2 วันที่แล้ว",
    likes: 89,
    comments: [
      {
        id: 1,
        author: "เภสัชกร สมพร กล้าหาญ",
        avatar: "/placeholder-user.jpg",
        content: "เคารพในความทุ่มเทครับ! คุณคือแรงบันดาลใจของเรา",
        timestamp: "2 วันที่แล้ว",
      },
    ],
    isLiked: true,
  },
  {
    id: 7,
    author: {
      name: "เภสัชกร รัชนี สวยงาม",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรโรงพยาบาลเด็ก",
      graduationYear: 2021,
    },
    content:
      "การดูแลเด็กป่วยต้องใช้ความละเอียดอ่อนเป็นพิเศษ วันนี้ได้ช่วยคุณหมอปรับขนาดยาให้น้องๆ อย่างปลอดภัย เด็กคือคนไข้พิเศษที่ต้องการความเอาใจใส่มากกว่า 👶💉",
    timestamp: "3 วันที่แล้ว",
    likes: 42,
    comments: [],
    isLiked: false,
  },
  {
    id: 8,
    author: {
      name: "เภสัชกร อรุณ เช้าใส",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรวิจัยและพัฒนา",
      graduationYear: 2014,
    },
    content:
      "เมื่อเช้าได้นำเสนอผลงานวิจัยใหม่เรื่อง 'การพัฒนายาต้านไวรัสจากสมุนไพรไทย' ในงานประชุมวิชาการระดับชาติ ภูมิใจที่ได้ใช้ความรู้พัฒนายาไทยเพื่อคนไทย 🧪📊",
    image: "/placeholder.jpg",
    timestamp: "4 วันที่แล้ว",
    likes: 76,
    comments: [
      {
        id: 1,
        author: "เภสัชกร วิชญา นักคิด",
        avatar: "/placeholder-user.jpg",
        content: "ผลงานน่าสนใจมากครับ! ขอชมเชยและขอแสดงความยินดีด้วย",
        timestamp: "4 วันที่แล้ว",
      },
      {
        id: 2,
        author: "เภสัชกร ชัยพร เก่งมาก",
        avatar: "/placeholder-user.jpg",
        content: "อยากทราบรายละเอียดเพิ่มเติมครับ งานวิจัยน่าติดตามมาก",
        timestamp: "3 วันที่แล้ว",
      },
    ],
    isLiked: true,
  },
  {
    id: 9,
    author: {
      name: "เภสัชกร สิริ แสงทอง",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรเครื่องสำอาง",
      graduationYear: 2022,
    },
    content:
      "วันนี้ได้เข้าร่วมสัมมนา 'แนวโน้มอุตสาหกรรมเครื่องสำอางไทย' เทรนด์ Clean Beauty และ Sustainable Cosmetics กำลังมาแรงมาก! เป็นโอกาสดีสำหรับเภสัชกรที่สนใจสาขานี้ 💄✨",
    timestamp: "5 วันที่แล้ว",
    likes: 38,
    comments: [
      {
        id: 1,
        author: "เภสัชกร นภา ใสใจ",
        avatar: "/placeholder-user.jpg",
        content: "สนใจมากค่ะ! มีข้อมูลการอบรมเพิ่มเติมไหมคะ",
        timestamp: "5 วันที่แล้ว",
      },
    ],
    isLiked: false,
  },
  {
    id: 10,
    author: {
      name: "เภสัชกร พิชิต ใจกล้า",
      avatar: "/placeholder-user.jpg",
      title: "เภสัชกรนิติเภสัช",
      graduationYear: 2013,
    },
    content:
      "เพิ่งจบการตรวจสอบร้านยาผิดกฎหมาย การดูแลให้ประชาชนได้รับยาที่ปลอดภัยและมีคุณภาพคือหน้าที่สำคัญของเรา กฎหมายยาและเภสัชกรรมคือเกราะป้องกันสุขภาพของคนไทย ⚖️🛡️",
    timestamp: "6 วันที่แล้ว",
    likes: 55,
    comments: [
      {
        id: 1,
        author: "เภสัชกร สุชาติ ยุติธรรม",
        avatar: "/placeholder-user.jpg",
        content: "ขอบคุณสำหรับการปกป้องผู้บริโภคครับ งานสำคัญมาก",
        timestamp: "6 วันที่แล้ว",
      },
    ],
    isLiked: true,
  },
];

const mockNews: News[] = [
  {
    id: 1,
    title: "ประกาศรับสมัครงานเภสัชกรโรงพยาบาลเอกชน",
    excerpt: "โรงพยาบาลเอกชนชั้นนำหลายแห่งเปิดรับสมัครเภสัชกรประจำ...",
    image: "/placeholder.jpg",
    timestamp: "1 วันที่แล้ว",
    category: "งาน",
  },
  {
    id: 2,
    title: "การอบรมเชิงปฏิบัติการ: เภสัชกรรมคลินิกสมัยใหม่",
    excerpt: "สภาเภสัชกรรมจัดการอบรมเพื่อยกระดับทักษะเภสัชกร...",
    image: "/placeholder.jpg",
    timestamp: "2 วันที่แล้ว",
    category: "การศึกษา",
  },
  {
    id: 3,
    title: "อัปเดตแนวทางการรักษาใหม่ของ WHO",
    excerpt: "องค์การอนามัยโลกประกาศแนวทางการรักษาที่อัปเดต...",
    image: "/placeholder.jpg",
    timestamp: "3 วันที่แล้ว",
    category: "ข่าวสาร",
  },
];

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts.slice(0, 5)); // เริ่มต้นด้วย 5 posts
  const [allPosts] = useState<Post[]>(mockPosts); // เก็บ posts ทั้งหมด
  const [newPost, setNewPost] = useState("");
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load more posts function
  const loadMorePosts = () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const currentLength = posts.length;
      const nextPosts = allPosts.slice(currentLength, currentLength + 5);

      if (nextPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...nextPosts]);
      }

      setLoading(false);
    }, 1000);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [posts, loading, hasMore]);

  const handlePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        author: {
          name: "เภสัชกร คุณ",
          avatar: "/placeholder-user.jpg",
          title: "เภสัชกรศิษย์เก่า WU",
          graduationYear: 2020,
        },
        content: newPost,
        timestamp: "เมื่อสักครู่",
        likes: 0,
        comments: [],
        isLiked: false,
      };
      // เพิ่มโพสต์ใหม่ที่ด้านบนสุด
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: number) => {
    const comment = newComment[postId];
    if (comment?.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: Date.now(),
                    author: "เภสัชกร คุณ",
                    avatar: "/placeholder-user.jpg",
                    content: comment,
                    timestamp: "เมื่อสักครู่",
                  },
                ],
              }
            : post
        )
      );
      setNewComment({ ...newComment, [postId]: "" });
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <Users className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            2,847
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            เภสัชกรศิษย์เก่า
          </div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <Briefcase className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            156
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ตำแหน่งงาน
          </div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <MessageSquare className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            298
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            กระทู้วิชาชีพ
          </div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <MapPin className="h-8 w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            45
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            จังหวัด
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <img
                    src="/placeholder-user.jpg"
                    alt="Your avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="แลกเปลี่ยนประสบการณ์วิชาชีพ หรือข้อมูลข่าวสารที่น่าสนใจ..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="resize-none border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                    rows={6}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        รูปภาพ
                      </Button>
                    </div>
                    <Button
                      onClick={handlePost}
                      disabled={!newPost.trim()}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      โพสต์
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0"
            >
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {post.author.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <span>{post.author.title}</span>
                        <span>•</span>
                        <span>รุ่น {post.author.graduationYear}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`${
                        post.isLiked
                          ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          : "text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          post.isLiked ? "fill-current" : ""
                        }`}
                      />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {post.comments.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-green-600"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      แชร์
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="mt-4 pt-4">
                    {/* Existing Comments */}
                    <div className="space-y-3 mb-4">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="w-8 h-8">
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </Avatar>
                          <div className="flex-1">
                            <div className="rounded-lg p-3">
                              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {comment.author}
                              </p>
                              <p className="text-gray-800 dark:text-gray-100">
                                {comment.content}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 ml-3">
                              {comment.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <img
                          src="/placeholder-user.jpg"
                          alt="Your avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Textarea
                          placeholder="เขียนความคิดเห็น..."
                          value={newComment[post.id] || ""}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              [post.id]: e.target.value,
                            })
                          }
                          className="resize-none"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Loading indicator */}
          {loading && (
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400"></div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    กำลังโหลดโพสต์เพิ่มเติม...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intersection observer sentinel */}
          <div id="scroll-sentinel" className="h-4"></div>

          {/* End of posts message */}
          {!hasMore && !loading && (
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>คุณได้อ่านโพสต์ทั้งหมดแล้ว</p>
                  <p className="text-sm mt-1">
                    สร้างโพสต์ใหม่เพื่อแลกเปลี่ยนประสบการณ์กันเถอะ! 💪
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent News */}
          <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  ข่าวสารล่าสุด
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockNews.map((news) => (
                <div
                  key={news.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex space-x-3">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100  mb-1 line-clamp-2">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-200 mb-2 line-clamp-2">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {news.category}
                        </span>
                        <span>{news.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ลิงก์ด่วน
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Users className="h-4 w-4 mr-3" />
                ค้นหาเภสัชกรศิษย์เก่า
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Briefcase className="h-4 w-4 mr-3" />
                ตำแหน่งงานว่าง
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <GraduationCap className="h-4 w-4 mr-3" />
                หลักสูตรอบรม
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MapPin className="h-4 w-4 mr-3" />
                แผนที่เภสัชกร
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
