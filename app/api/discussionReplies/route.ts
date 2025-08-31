import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_id, content, user_id } = body;
    if (!content || !topic_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const addtTopic = await prisma.discussion_replies.create({
      data: {
        topic_id,
        content,
        user_id,
      },
    });

    const topic = await prisma.discussion_replies.findUnique({
      where: {
        id: addtTopic.id,
      },
      select: {
        id: true,
        content: true,
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            alumni_profiles: {
              select: {
                id: true,
                admit_year: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ topic });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
