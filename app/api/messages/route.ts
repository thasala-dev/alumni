import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/messages?userId=xxx — conversation list for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  // Get all messages involving this user, grouped by the other party
  const messages = await prisma.direct_messages.findMany({
    where: {
      OR: [{ sender_id: userId }, { receiver_id: userId }],
    },
    orderBy: { created_at: "desc" },
    include: {
      sender: {
        select: {
          id: true, name: true, image: true,
          alumni_profiles: { select: { first_name: true, last_name: true, profile_image_url: true }, take: 1 },
        },
      },
      receiver: {
        select: {
          id: true, name: true, image: true,
          alumni_profiles: { select: { first_name: true, last_name: true, profile_image_url: true }, take: 1 },
        },
      },
    },
  });

  const resolveUser = (u: any) => {
    const p = u.alumni_profiles?.[0];
    return {
      id: u.id,
      name: u.name || (p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() : null) || "ผู้ใช้งาน",
      image: u.image || p?.profile_image_url || null,
    };
  };

  // Group into conversations keyed by the other user's id
  const conversationMap = new Map<string, any>();
  for (const msg of messages) {
    const rawOther = msg.sender_id === userId ? msg.receiver : msg.sender;
    const other = resolveUser(rawOther);
    if (!conversationMap.has(other.id)) {
      const unreadCount = messages.filter(
        (m) => m.sender_id === other.id && m.receiver_id === userId && !m.is_read
      ).length;
      conversationMap.set(other.id, {
        user: other,
        lastMessage: msg.content,
        lastAt: msg.created_at,
        unread: unreadCount,
      });
    }
  }

  return NextResponse.json({ conversations: Array.from(conversationMap.values()) });
}

// POST /api/messages — send a message
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sender_id, receiver_id, content } = body;

  if (!sender_id || !receiver_id || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Only APPROVED users can send
  const sender = await prisma.user.findUnique({
    where: { id: sender_id },
    select: { status: true },
  });

  if (sender?.status !== "APPROVED") {
    return NextResponse.json({ error: "Only approved users can send messages" }, { status: 403 });
  }

  const message = await prisma.direct_messages.create({
    data: {
      sender_id,
      receiver_id,
      content: content.trim(),
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json({ message });
}
