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
  ShieldCheck,
  Calendar,
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

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ยกเลิก
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "กำลังลบ..." : "ลบ"}
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedComments, setExpandedComments] = useState<{
    [key: number]: boolean;
  }>({});

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    limit: 10,
  });

  const [stat, setStat] = useState({
    alumni: 0,
    discussion: 0,
    news: 0,
    province: 0,
  });

  // Delete confirmation states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirmCommentDialog, setShowConfirmCommentDialog] =
    useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);

  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const statRes = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!statRes.ok) throw new Error("Failed to fetch statistics");

        const statData = await statRes.json();
        setStat(statData.stat);
        setLatestNews(statData.latestNews || []);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStat();
  }, []);

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

  const handleDeleteTopics = async (postId: number) => {
    setDeletingPostId(postId);
    setShowConfirmDialog(true);
  };

  const confirmDeleteTopic = async () => {
    if (!deletingPostId) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/discussionTopics/${deletingPostId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to delete post");

      // Remove the post from the list
      setPosts(posts.filter((post) => post.id !== deletingPostId));

      // Close dialog and reset state
      setShowConfirmDialog(false);
      setDeletingPostId(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setDeleteLoading(false);
  };

  const cancelDeleteTopic = () => {
    setShowConfirmDialog(false);
    setDeletingPostId(null);
  };

  const handleDeleteComment = (commentId: number) => {
    setDeletingCommentId(commentId);
    setShowConfirmCommentDialog(true);
  };

  const confirmDeleteComment = async () => {
    if (!deletingCommentId) return;

    setDeleteCommentLoading(true);
    try {
      const res = await fetch(`/api/discussionReplies/${deletingCommentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to delete comment");

      // Remove the comment from the posts
      setPosts(
        posts.map((post) => ({
          ...post,
          discussion_replies: post.discussion_replies.filter(
            (comment: any) => comment.id !== deletingCommentId
          ),
        }))
      );

      // Close dialog and reset state
      setShowConfirmCommentDialog(false);
      setDeletingCommentId(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    setDeleteCommentLoading(false);
  };

  const cancelDeleteComment = () => {
    setShowConfirmCommentDialog(false);
    setDeletingCommentId(null);
  };

  const toggleComments = (postId: number) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };

  const togglePostExpansion = (postId: number) => {
    setExpandedPosts({
      ...expandedPosts,
      [postId]: !expandedPosts[postId],
    });
  };

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments({
      ...expandedComments,
      [commentId]: !expandedComments[commentId],
    });
  };

  const shouldTruncateContent = (content: string) => {
    const lines = content.split("\n");
    return lines.length > 3 || content.length > 200;
  };

  const getTruncatedContent = (content: string) => {
    if (content.length > 200) {
      return content.substring(0, 200);
    }
    return content;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <Users className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stat.alumni.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ศิษย์เก่า
          </div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <MapPin className="h-8 w-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stat.province}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            จังหวัด
          </div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <Newspaper className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stat.news}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ข่าวสาร
          </div>
        </Card>
        <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <MessageSquare className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stat.discussion}
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
                          {post.user?.alumni_profiles.length > 0 ? (
                            <a
                              className="items-center"
                              href={`/dashboard/alumni/${post.user?.alumni_profiles[0]?.id}`}
                            >
                              {post.user?.name}
                            </a>
                          ) : (
                            <div className="items-center">
                              {post.user?.name}
                            </div>
                          )}

                          {post.user?.role === "admin" && (
                            <ShieldCheck className="h-5 w-5 text-blue-500" />
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
                              {post.user?.alumni_profiles[0]
                                ?.current_position && (
                                <>
                                  <Briefcase className="h-4 w-4" />
                                  <span>
                                    {
                                      post.user?.alumni_profiles[0]
                                        ?.current_position
                                    }
                                  </span>
                                </>
                              )}
                              {post.user?.alumni_profiles[0]
                                ?.current_province && (
                                <>
                                  <MapPin className="h-4 w-4" />
                                  <span>
                                    {
                                      post.user?.alumni_profiles[0]
                                        ?.current_province
                                    }
                                  </span>
                                </>
                              )}
                            </>
                          )}

                          <Clock className="h-4 w-4" />
                          <span>{timeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex space-x-3">
                        {post.category_id === "99" ? (
                          <a href={`/dashboard/news/${post.id}`}>
                            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                              {post.title}
                            </div>
                          </a>
                        ) : (
                          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {post.title}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {discussionCategory
                          .filter(
                            (category) => category.id === post.category_id
                          )
                          .map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center"
                            >
                              <a
                                href={`/dashboard/discussion/${category.id}`}
                                className="flex items-center"
                              >
                                <category.icon
                                  className={`mr-1.5 h-4 w-4 ${category.color}`}
                                />
                                <span className={category.color}>
                                  {category.name}
                                </span>
                              </a>
                            </div>
                          ))}

                        <div className="flex items-center">
                          <User className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                          {post.user?.name}
                        </div>

                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />{" "}
                          {timeAgo(post.created_at)}
                        </div>
                      </div>
                    </div>
                  )}

                  {post.category_id === "0" && post.user?.id === user?.id && (
                    <Button
                      onClick={() => handleDeleteTopics(post.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {post.category_id === "99" && post.image && (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full max-h-100 object-contain rounded border border-gray-200 dark:border-gray-700 mb-4"
                  />
                )}

                {/* Post Content */}
                <div className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                  <div className="whitespace-pre-wrap">
                    {expandedPosts[post.id] ||
                    !shouldTruncateContent(post.content)
                      ? post.content
                      : getTruncatedContent(post.content)}
                  </div>
                  {shouldTruncateContent(post.content) && (
                    <div
                      onClick={() => togglePostExpansion(post.id)}
                      className="text-[#81B214]  font-medium mt-2 text-sm cursor-pointer"
                    >
                      {expandedPosts[post.id] ? "ย่อเนื้อหา" : "...อ่านต่อ"}
                    </div>
                  )}
                </div>

                {/* Post Image */}
                {post.category_id !== "99" && post.image && (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full max-h-100 object-contain rounded border border-gray-200 dark:border-gray-700 mb-4"
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
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex flex-row items-top gap-2 mb-2">
                                    {comment.user?.alumni_profiles.length >
                                    0 ? (
                                      <a
                                        className="items-center"
                                        href={`/dashboard/alumni/${comment.user?.alumni_profiles[0]?.id}`}
                                      >
                                        {comment.user?.name}
                                      </a>
                                    ) : (
                                      <div className="items-center">
                                        {comment.user?.name}
                                      </div>
                                    )}

                                    {comment.user?.role === "admin" && (
                                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                                    )}
                                  </div>
                                </div>
                                {comment.user?.id === user?.id && (
                                  <Button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                <div className="whitespace-pre-wrap">
                                  {expandedComments[comment.id] ||
                                  !shouldTruncateContent(comment.content)
                                    ? comment.content
                                    : getTruncatedContent(comment.content)}
                                </div>
                                {shouldTruncateContent(comment.content) && (
                                  <button
                                    onClick={() =>
                                      toggleCommentExpansion(comment.id)
                                    }
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mt-1 text-xs"
                                  >
                                    {expandedComments[comment.id]
                                      ? "ย่อ"
                                      : "อ่านต่อ..."}
                                  </button>
                                )}
                              </div>
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
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.image} />
                          <AvatarFallback className="bg-[#81B214]/10 dark:bg-[#81B214] text-[#81B214] dark:text-white text-2xl font-semibold">
                            {user?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
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
        <div className="hidden sm:block space-y-6">
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
              {latestNews.map((news: any, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex space-x-3">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <a href={`/news/${news.id}`}>
                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100  mb-1 line-clamp-2">
                          {news.title}
                        </h4>
                      </a>
                      <p className="text-xs text-gray-600 dark:text-gray-200 mb-2 line-clamp-2">
                        {news.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                        <span>{timeAgo(news.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={showConfirmDialog}
        onClose={cancelDeleteTopic}
        onConfirm={confirmDeleteTopic}
        title="ยืนยันการลบโพสต์"
        message="คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?"
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={showConfirmCommentDialog}
        onClose={cancelDeleteComment}
        onConfirm={confirmDeleteComment}
        title="ยืนยันการลบความคิดเห็น"
        message="คุณแน่ใจหรือไม่ที่จะลบความคิดเห็นนี้?"
        loading={deleteCommentLoading}
      />

      <ImageUrlDialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        value={newPostImage}
        onChange={setNewPostImage}
      />
    </div>
  );
}
