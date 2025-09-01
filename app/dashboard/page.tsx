"use client";

import { useEffect, useState } from "react";
import { discussionCategory } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Verified,
  X,
  Trash,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AdmitYear, timeAgo } from "@/lib/utils";

function ImageUrlDialog({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm relative animate-fade-in-up">
        <div className="mb-2 font-semibold text-gray-900 dark:text-white">
          แนบรูปภาพ (URL)
        </div>
        <input
          type="url"
          placeholder="วางลิงก์รูปภาพ (URL)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#81B214] dark:bg-gray-800 dark:text-white"
        />
        {value && (
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded border border-gray-200 dark:border-gray-700 mt-3"
          />
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  timestamp: string;
  category: string;
}

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
  const { user, isLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [newPostImage, setNewPostImage] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    limit: 10,
  });

  const loadMorePosts = async ({ page, limit, user_id }: any) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        user_id: user_id,
      });

      const res = await fetch(`/api/discussionTopics?${searchParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to create post");

      const { data, total } = await res.json();
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newData = data.filter((item: any) => !existingIds.has(item.id));
        return [...prev, ...newData];
      });

      setHasMore(data.length > 0);
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading && user) {
      loadMorePosts({
        page: pagination.current,
        limit: pagination.limit,
        user_id: user?.id,
      });
    }
  }, [pagination.current, isLoading, user]);

  const handlePost = async () => {
    if (newPost.trim()) {
      const data: any = {
        category_id: "0",
        user_id: user?.id,
        content: newPost,
        image: newPostImage || undefined,
      };

      try {
        const res = await fetch("/api/discussionTopics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create post");

        setPosts([]);
        if (pagination.current !== 1) {
          setPagination({
            current: 1,
            total: 1,
            count: 1,
            limit: 10,
          });
        } else {
          loadMorePosts({
            page: pagination.current,
            limit: pagination.limit,
            user_id: user?.id,
          });
        }

        setNewPost("");
        setNewPostImage("");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleLike = async (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    const data: any = {
      topic_id: postId,
      user_id: user?.id,
      isLiked: !post.isLiked,
    };

    try {
      const res = await fetch("/api/discussionLikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create post");
      const resData = await res.json();

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                discussion_likes: resData.data,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: number) => {
    const comment = newComment[postId];
    if (comment?.trim()) {
      console.log("New comment:", comment, postId);
      const data: any = {
        topic_id: postId,
        user_id: user?.id,
        content: comment,
      };
      try {
        const res = await fetch("/api/discussionReplies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create post");
        const resData = await res.json();

        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  discussion_replies: [
                    ...(post.discussion_replies || []),
                    resData.topic,
                  ],
                }
              : post
          )
        );
        setNewComment({ ...newComment, [postId]: "" });
      } catch (error) {
        console.error("Error creating post:", error);
      }
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <Users className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            2,847
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ศิษย์เก่า
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
            กระทู้ศิษย์เก่า
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white text-2xl font-semibold">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    placeholder="แลกเปลี่ยนประสบการณ์ หรือข้อมูลข่าวสารที่น่าสนใจ..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="resize-none border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                    rows={8}
                  />
                  {newPostImage && (
                    <div className="mt-3 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer shadow z-10"
                        onClick={() => setNewPostImage("")}
                        aria-label="ลบรูปภาพ"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        src={newPostImage}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        onClick={() => setShowImageDialog(true)}
                      >
                        <Camera className="h-4 w-4 mr-2 text-[#81B214]" />
                        รูปภาพ
                      </Button>
                    </div>
                    <Button
                      onClick={handlePost}
                      disabled={!newPost.trim()}
                      className="bg-[#81B214] text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      โพสต์
                    </Button>
                  </div>
                  <ImageUrlDialog
                    open={showImageDialog}
                    onClose={() => setShowImageDialog(false)}
                    value={newPostImage}
                    onChange={setNewPostImage}
                  />
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
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  {post.category_id === "0" ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.user?.image} />
                        <AvatarFallback className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white text-2xl font-semibold">
                          {post.user?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 flex flex-row items-top gap-2">
                          <div className="items-center">{post.user?.name}</div>
                          {post.user?.role === "admin" && (
                            <Verified className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                          {post.user?.alumni_profiles.length > 0 && (
                            <>
                              {post.user?.alumni_profiles[0]?.name && (
                                <>
                                  <span>
                                    {post.user?.alumni_profiles[0]?.name}
                                  </span>
                                  <span>•</span>
                                </>
                              )}

                              <span>
                                รุ่นที่{" "}
                                {AdmitYear(
                                  post.user?.alumni_profiles[0]?.admit_year
                                )}
                              </span>
                              <span>•</span>
                            </>
                          )}

                          <Clock className="h-3 w-3" />
                          <span>{timeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex space-x-3">
                        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </div>
                      </div>
                      {discussionCategory
                        .filter((category) => category.id === post.category_id)
                        .map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <category.icon
                              className={`h-4 w-4 ${category.color}`}
                            />
                            <span className={category.color}>
                              {category.name}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>
                              <User className="h-4 w-4 text-gray-500" />
                            </span>
                            <span className="text-gray-500">
                              {post.user?.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}

                  {post.user?.id === user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
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
                    <div
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 cursor-pointer ${
                        post.isLiked
                          ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          : "text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      }`}
                    >
                      <Heart
                        className={`h-6 w-6 mr-2 ${
                          post.isLiked ? "fill-current" : ""
                        }`}
                      />
                      {post.discussion_likes.length}
                    </div>
                    <div
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600"
                    >
                      <MessageCircle className="h-6 w-6 mr-2 " />
                      {post.discussion_replies?.length}
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="pt-4">
                    {/* Existing Comments */}
                    <div className="space-y-3 mb-4">
                      {post.discussion_replies.map((comment: any) => (
                        <div
                          key={comment.id}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user?.image} />
                            <AvatarFallback className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white text-2xl font-semibold">
                              {comment.user?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="rounded-lg pl-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex flex-row items-top gap-2 mb-2">
                                  <div className="items-center">
                                    {comment.user?.name}
                                  </div>
                                  {comment.user?.role === "admin" && (
                                    <Verified className="h-5 w-5 text-blue-500" />
                                  )}
                                </div>
                                {comment.user?.id === user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-gray-800 dark:text-gray-100">
                                {comment.content}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 ml-3">
                              {timeAgo(comment.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <img
                          src={user?.image || "/placeholder-user.jpg"}
                          alt="Your avatar"
                          className="w-full h-full object-cover rounded-full border border-[#81B214] border-2"
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
                          className="resize-none border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                          rows={2}
                        />
                        <Button
                          onClick={() => handleComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                          className="bg-[#81B214] text-white"
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

          {/* Load more button */}
          {hasMore && !loading && (
            <div className="flex justify-center my-4">
              <div
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    current: prev.current + 1,
                  }))
                }
                className="text-[#81B214] bg-[#81B214]/10 w-full p-8 text-lg font-semibold cursor-pointer rounded-md text-center hover:bg-[#81B214]/20 transition"
              >
                โหลดโพสต์เพิ่มเติม
              </div>
            </div>
          )}

          {/* End of posts message */}
          {!hasMore && !loading && (
            <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
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
                ค้นหาศิษย์เก่า
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
