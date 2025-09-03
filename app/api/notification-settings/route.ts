import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/notification-settings - get notification settings by user_id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const settings = await prisma.notification_settings.findFirst({
      where: { user_id: user_id },
    });

    if (!settings) {
      // Return default notification settings if none exist
      return NextResponse.json({
        email_notifications: true,
        discussion_replies: true,
        news_updates: true,
        birthday_reminders: false,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/notification-settings - update notification settings
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { user_id, ...settingsData } = data;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Find existing settings
    const existingSettings = await prisma.notification_settings.findFirst({
      where: { user_id: user_id },
    });

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.notification_settings.update({
        where: { id: existingSettings.id },
        data: settingsData,
      });
    } else {
      // Create new settings
      settings = await prisma.notification_settings.create({
        data: {
          user_id: user_id,
          ...settingsData,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
