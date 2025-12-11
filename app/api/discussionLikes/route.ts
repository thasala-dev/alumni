import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_id, isLiked, user_id } = body;
    if (!topic_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isLiked && isLiked === true) {
      await prisma.discussion_likes.create({
        data: {
          topic_id,
          user_id,
        },
      });
    } else {
      await prisma.discussion_likes.deleteMany({
        where: {
          topic_id,
          user_id,
        },
      });
    }

    const discussionLikes = await prisma.discussion_likes.findMany({
      where: {
        topic_id,
      },
      select: {
        id: true,
        user_id: true,
      },
    });

    return NextResponse.json({ data: discussionLikes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
