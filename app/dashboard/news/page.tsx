"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Newspaper,
  Plus,
  Search,
  MessageCircle,
  Calendar,
  Edit,
  Trash2,
  ShieldCheck,
  Send,
  Clock,
  User,
  Trash,
  Heart,
  X,
  Camera,
} from "lucide-react";
import { AdmitYear, timeAgo, discussionCategory } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

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

function NewsDialog({
  open,
  onClose,
  onSave,
  editingPost,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingPost?: any;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes or editing post changes
  useEffect(() => {
    if (open) {
      if (editingPost) {
        setTitle(editingPost.title || "");
        setContent(editingPost.content || "");
        setImage(editingPost.image || "");
      } else {
        setTitle("");
        setContent("");
        setImage("");
      }
    }
  }, [open, editingPost]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        image: image.trim() || undefined,
      });

      // Reset form
      setTitle("");
      setContent("");
      setImage("");
      onClose();
    } catch (error) {
      console.error("Error saving news:", error);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-2xl relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingPost ? "แก้ไขข่าว" : "เพิ่มข่าวใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              หัวข้อข่าว *
            </label>
            <Input
              placeholder="กรอกหัวข้อข่าว..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เนื้อหาข่าว *
            </label>
            <Textarea
              placeholder="กรอกเนื้อหาข่าว..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none"
              rows={8}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              รูปภาพประกอบ
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="URL รูปภาพ (ไม่บังคับ)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImageDialog(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {image && (
              <div className="mt-3 relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer shadow z-10"
                  onClick={() => setImage("")}
                  aria-label="ลบรูปภาพ"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={image}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || loading}
            className="bg-[#81B214] hover:bg-[#50B003]"
          >
            {loading
              ? "กำลังบันทึก..."
              : editingPost
              ? "บันทึกการแก้ไข"
              : "สร้างข่าว"}
          </Button>
        </div>

        {/* Image URL Dialog */}
        <ImageUrlDialog
          open={showImageDialog}
          onClose={() => setShowImageDialog(false)}
          value={image}
          onChange={setImage}
        />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { user, isLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedComments, setExpandedComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true); // Start loading to simulate fetch
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
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
        category_id: "99",
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

  const handleCreateNews = () => {
    setEditingPost(null);
    setShowNewsDialog(true);
  };

  const handleEditNews = (post: any) => {
    setEditingPost(post);
    setShowNewsDialog(true);
  };

  const handleSaveNews = async (newsData: any) => {
    try {
      if (editingPost) {
        // Update existing news
        const res = await fetch(`/api/discussionTopics/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newsData,
            category_id: "99",
            user_id: user?.id,
          }),
        });
        if (!res.ok) throw new Error("Failed to update news");

        // Update the post in the list
        setPosts(
          posts.map((post) =>
            post.id === editingPost.id ? { ...post, ...newsData } : post
          )
        );
      } else {
        // Create new news
        const res = await fetch("/api/discussionTopics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newsData,
            category_id: "99",
            user_id: user?.id,
          }),
        });
        if (!res.ok) throw new Error("Failed to create news");

        // Refresh the posts list
        setPosts([]);
        setPagination((prev) => ({ ...prev, current: 1 }));
        loadMorePosts({
          page: 1,
          limit: pagination.limit,
          user_id: user?.id,
        });
      }
    } catch (error) {
      console.error("Error saving news:", error);
      throw error;
    }
  };

  const handleDeleteNews = async (postId: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข่าวนี้?")) return;

    try {
      const res = await fetch(`/api/discussionTopics/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete news");

      // Remove the post from the list
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#81B214]">ข่าวสาร</h1>{" "}
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ข่าวประชาสัมพันธ์และกิจกรรมต่างๆ
          </p>
        </div>
        {user?.role === "admin" && (
          <Button
            onClick={handleCreateNews}
            className="rounded-lg bg-[#81B214] hover:bg-[#50B003] transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มข่าวใหม่
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 p-0"
            >
              <CardContent className="p-4">
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

                  {post.user?.id === user?.id && (
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => handleEditNews(post)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteNews(post.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex flex-row items-top gap-2 mb-2">
                                  <div className="items-center">
                                    {comment.user?.name}
                                  </div>
                                  {comment.user?.role === "admin" && (
                                    <ShieldCheck className="h-5 w-5 text-blue-500" />
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
        </div>
      </div>

      {/* News Dialog */}
      <NewsDialog
        open={showNewsDialog}
        onClose={() => setShowNewsDialog(false)}
        onSave={handleSaveNews}
        editingPost={editingPost}
      />
    </div>
  );
}
