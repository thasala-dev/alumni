import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get a specific discussion reply
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reply = await prisma.discussion_replies.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        topic_id: true,
        content: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reply" },
      { status: 500 }
    );
  }
}

// PUT: Update a discussion reply
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { content, user_id } = body;

    if (!content || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the reply exists and user owns it
    const existingReply = await prisma.discussion_replies.findUnique({
      where: { id: params.id },
    });

    if (!existingReply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    if (existingReply.user_id !== user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedReply = await prisma.discussion_replies.update({
      where: { id: params.id },
      data: {
        content,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ reply: updatedReply });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update reply" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a discussion reply
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user_id from request body
    const body = await req.json().catch(() => ({}));
    const user_id = body.user_id;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Check if the reply exists
    const existingReply = await prisma.discussion_replies.findUnique({
      where: { id: params.id },
    });

    if (!existingReply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    // Check if user owns the reply or is admin
    if (existingReply.user_id !== user_id) {
      // You might want to add admin check here
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the reply
    await prisma.discussion_replies.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Reply deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}
