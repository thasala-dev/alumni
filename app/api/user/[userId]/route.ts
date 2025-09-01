import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// PUT /api/user/[userId] - update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const updates = await request.json();

    // Validate allowed update fields
    const allowedFields = ["status", "role", "email", "name"];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...filteredUpdates,
        updated_at: new Date(),
      },
      include: {
        alumni_profiles: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/[userId] - delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    // Prevent admin from deleting themselves
    if ((session.user as any).id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user and related data
    await prisma.$transaction(async (tx) => {
      // Delete alumni profile if exists
      await tx.alumni_profiles.deleteMany({
        where: { user_id: userId },
      });

      // Delete discussion topics created by user
      await tx.discussion_topics.deleteMany({
        where: { user_id: userId },
      });

      // Delete discussion replies by user
      await tx.discussion_replies.deleteMany({
        where: { user_id: userId },
      });

      // Delete discussion likes by user
      await tx.discussion_likes.deleteMany({
        where: { user_id: userId },
      });

      // Delete comments by user
      await tx.comments.deleteMany({
        where: { user_id: userId },
      });

      // Delete news by user
      await tx.news.deleteMany({
        where: { author_id: userId },
      });

      // Delete work history by user
      await tx.work_history.deleteMany({
        where: { user_id: userId },
      });

      // Delete notification settings by user
      await tx.notification_settings.deleteMany({
        where: { user_id: userId },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
