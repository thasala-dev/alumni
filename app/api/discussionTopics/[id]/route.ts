import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get a specific discussion topic
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const topic = await prisma.discussion_topics.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        category_id: true,
        title: true,
        content: true,
        image: true,
        created_at: true,
        updated_at: true,
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
        discussion_replies: {
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
              },
            },
          },
          orderBy: {
            created_at: "asc",
          },
        },
        discussion_likes: {
          select: {
            id: true,
            user_id: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

// PUT: Update a discussion topic
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { title, content, category_id, user_id, image } = body;

    if (!content || !category_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the topic exists and user owns it
    const existingTopic = await prisma.discussion_topics.findUnique({
      where: { id: params.id },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (existingTopic.user_id !== user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedTopic = await prisma.discussion_topics.update({
      where: { id: params.id },
      data: {
        title: title ?? null,
        content,
        category_id,
        image,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a discussion topic
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    // Get user_id from request body or headers
    const body = await req.json().catch(() => ({}));
    const user_id = body.user_id;

    // Check if the topic exists
    const existingTopic = await prisma.discussion_topics.findUnique({
      where: { id: params.id },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Check if user owns the topic or is admin
    if (existingTopic.user_id !== user_id) {
      // You might want to add admin check here
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete related data first (replies, likes)
    await prisma.discussion_replies.deleteMany({
      where: { topic_id: params.id },
    });

    await prisma.discussion_likes.deleteMany({
      where: { topic_id: params.id },
    });

    // Delete the topic
    await prisma.discussion_topics.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
