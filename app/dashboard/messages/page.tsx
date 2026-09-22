"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { timeAgo } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch {}
      setLoading(false);
    };
    fetch_();
  }, [user?.id]);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-[#81B214]">ข้อความ</h1>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
          <Send className="h-12 w-12 mb-4 opacity-20" />
          <p className="font-medium">ยังไม่มีข้อความ</p>
          <p className="text-sm mt-1">ไปที่หน้าโปรไฟล์ศิษย์เก่าเพื่อเริ่มการสนทนา</p>
        </div>
      )}

      <div className="space-y-2">
        {conversations.map((conv) => (
          <button
            key={conv.user.id}
            onClick={() => router.push(`/dashboard/messages/${conv.user.id}`)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#81B214]/40 hover:bg-[#81B214]/5 transition-all text-left group"
          >
            <div className="relative shrink-0">
              <Avatar className="h-11 w-11">
                <AvatarImage src={conv.user.image} />
                <AvatarFallback className="bg-[#81B214] text-white font-bold">
                  {conv.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {conv.unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full w-3 h-3 border-2 border-white dark:border-gray-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm truncate ${conv.unread > 0 ? "font-semibold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                  {conv.user.name}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                  {timeAgo(conv.lastAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className={`text-xs truncate flex-1 ${conv.unread > 0 ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
                  {conv.lastMessage}
                </p>
                {conv.unread > 0 && (
                  <span className="bg-[#81B214] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
