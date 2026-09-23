"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, GraduationCap, Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { timeAgo, AdmitYear } from "@/lib/utils";

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/messages/${userId}?currentUserId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
      setOtherUser(data.otherUser || null);

      // mark as read
      await fetch(`/api/messages/${userId}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: user.id }),
      });
    } catch {}
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchMessages();
      setLoading(false);
    };
    if (user?.id) {
      init();
      pollRef.current = setInterval(fetchMessages, 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [userId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: user?.id,
          receiver_id: userId,
          content: content.trim(),
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setContent("");
    } catch {}
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-9rem)] animate-pulse">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
        <div className="flex-1 space-y-3 px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl w-2/3 ${i % 2 === 0 ? "ml-auto" : ""}`} />
          ))}
        </div>
      </div>
    );
  }

  const profile = otherUser?.alumni_profiles?.[0];
  const displayName = otherUser?.name || "ผู้ใช้งาน";

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl mb-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-[#81B214] transition-colors shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={otherUser?.image} className="object-cover" />
          <AvatarFallback className="bg-[#81B214] text-white font-bold">
            {displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          {profile?.id ? (
            <a
              href={`/dashboard/alumni/${profile.id}`}
              className="font-semibold text-sm text-gray-900 dark:text-gray-100 hover:text-[#81B214] truncate block transition-colors"
            >
              {displayName}
            </a>
          ) : (
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
              {displayName}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {profile?.admit_year && (
              <>
                <GraduationCap className="h-3 w-3 shrink-0" />
                <span>รุ่นที่ {AdmitYear(profile.admit_year)}</span>
                <span className="mx-0.5">·</span>
              </>
            )}
            <Clock className="h-3 w-3 shrink-0" />
            <span>{timeAgo(otherUser?.updated_at ?? otherUser?.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <Send className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">เริ่มการสนทนากับ {displayName}</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
              {!isMine && (
                <Avatar className="h-7 w-7 shrink-0 mb-1">
                  <AvatarImage src={msg.sender?.image} />
                  <AvatarFallback className="bg-[#81B214] text-white text-xs font-bold">
                    {msg.sender?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`group max-w-[70%]`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isMine
                    ? "bg-[#81B214] text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
                <p className={`text-[10px] text-gray-400 dark:text-gray-500 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                  {timeAgo(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-2 py-3 bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <Avatar className="h-8 w-8 shrink-0 mb-0.5">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="bg-[#81B214] text-white text-xs font-bold">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`ส่งข้อความถึง ${displayName}… (Enter เพื่อส่ง)`}
          rows={1}
          className="flex-1 resize-none border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm rounded-xl max-h-32"
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="bg-[#81B214] hover:bg-[#50B003] text-white rounded-xl h-9 w-9 p-0 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
