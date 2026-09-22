import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/messages/[userId]?currentUserId=xxx — chat history between two users
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const { userId } = await props.params;
  const currentUserId = req.nextUrl.searchParams.get("currentUserId");

  if (!currentUserId) {
    return NextResponse.json({ error: "Missing currentUserId" }, { status: 400 });
  }

  const messages = await prisma.direct_messages.findMany({
    where: {
      OR: [
        { sender_id: currentUserId, receiver_id: userId },
        { sender_id: userId, receiver_id: currentUserId },
      ],
    },
    orderBy: { created_at: "asc" },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  });

  // Get other user info
  const rawUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      status: true,
      created_at: true,
      alumni_profiles: {
        select: { id: true, first_name: true, last_name: true, profile_image_url: true, admit_year: true, current_position: true, updated_at: true },
        take: 1,
      },
    },
  });

  // Resolve display name: prefer User.name → alumni first+last → fallback
  const profile = rawUser?.alumni_profiles?.[0];
  const otherUser = rawUser
    ? {
        ...rawUser,
        name:
          rawUser.name ||
          (profile?.first_name || profile?.last_name
            ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
            : null),
        image: rawUser.image || profile?.profile_image_url || null,
      }
    : null;

  return NextResponse.json({ messages, otherUser });
}
