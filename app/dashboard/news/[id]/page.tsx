"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Clock,
  Send,
  Trash,
  ShieldCheck,
  User,
} from "lucide-react";
import { timeAgo, AdmitYear } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/discussionTopics/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setNews({
            ...data.topic,
            isLiked: data.topic.discussion_likes?.some(
              (l: any) => l.user_id === user?.id
            ),
          });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    if (params.id) fetchNews();
  }, [params.id, user?.id]);

  const handleLike = async () => {
    if (!news) return;
    try {
      const res = await fetch("/api/discussionLikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: news.id,
          user_id: user?.id,
          isLiked: !news.isLiked,
        }),
      });
      if (!res.ok) return;
      const resData = await res.json();
      setNews((prev: any) => ({
        ...prev,
        isLiked: !prev.isLiked,
        discussion_likes: resData.data,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch("/api/discussionReplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: news.id,
          user_id: user?.id,
          content: newComment,
        }),
      });
      if (!res.ok) return;
      const resData = await res.json();
      setNews((prev: any) => ({
        ...prev,
        discussion_replies: [...(prev.discussion_replies || []), resData.topic],
      }));
      setNewComment("");
    } catch (e) {
      console.error(e);
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/discussionReplies/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id }),
      });
      if (!res.ok) return;
      setNews((prev: any) => ({
        ...prev,
        discussion_replies: prev.discussion_replies.filter(
          (c: any) => c.id !== commentId
        ),
      }));
    } catch (e) {
      console.error(e);
    }
    setDeletingCommentId(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-6xl">📰</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ไม่พบข่าวสาร</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#81B214] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับ
      </button>

      {/* News Card */}
      <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover image */}
        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="w-full max-h-96 object-cover"
          />
        )}

        <CardContent className="p-6 space-y-4">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
            {news.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={news.user?.image} />
              <AvatarFallback className="bg-[#81B214] text-white font-bold">
                {news.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                {news.user?.alumni_profiles?.length > 0 ? (
                  <a
                    href={`/dashboard/alumni/${news.user.alumni_profiles[0].id}`}
                    className="hover:text-[#81B214] transition-colors"
                  >
                    {news.user?.name}
                  </a>
                ) : (
                  <span>{news.user?.name}</span>
                )}
                {news.user?.role === "admin" && (
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{timeAgo(news.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700" />

          {/* Content */}
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">
            {news.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm transition-colors ${
                news.isLiked
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`h-5 w-5 ${news.isLiked ? "fill-current" : ""}`} />
              <span>{news.discussion_likes?.length ?? 0} ถูกใจ</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-5 w-5" />
              <span>{news.discussion_replies?.length ?? 0} ความคิดเห็น</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card className="bg-white dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            ความคิดเห็น ({news.discussion_replies?.length ?? 0})
          </h2>

          {/* Comment list */}
          <div className="space-y-4">
            {news.discussion_replies?.map((comment: any) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={comment.user?.image} />
                  <AvatarFallback className="bg-[#81B214] text-white text-xs font-bold">
                    {comment.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {comment.user?.name}
                      {comment.user?.role === "admin" && (
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </div>
                    {comment.user?.id === user?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingCommentId === comment.id}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {timeAgo(comment.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {news.discussion_replies?.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น!
              </p>
            )}
          </div>

          {/* Add comment */}
          <div className="flex items-start gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-[#81B214] text-white text-xs font-bold">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="เขียนความคิดเห็น..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                className="resize-none text-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={handleComment}
                disabled={!newComment.trim() || commentLoading}
                className="bg-[#81B214] hover:bg-[#50B003] text-white self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
