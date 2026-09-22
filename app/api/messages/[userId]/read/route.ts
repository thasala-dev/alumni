import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/messages/[userId]/read — mark all messages from userId as read
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const { userId } = await props.params;
  const { currentUserId } = await req.json();

  if (!currentUserId) {
    return NextResponse.json({ error: "Missing currentUserId" }, { status: 400 });
  }

  await prisma.direct_messages.updateMany({
    where: {
      sender_id: userId,
      receiver_id: currentUserId,
      is_read: false,
    },
    data: { is_read: true },
  });

  return NextResponse.json({ ok: true });
}
