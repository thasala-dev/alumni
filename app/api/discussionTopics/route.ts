import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List all discussion topics
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const user_id = searchParams.get("user_id");
  const category_id = searchParams.get("category_id");

  try {
    const [data] = await Promise.all([
      prisma.discussion_topics.findMany({
        where: {
          category_id: category_id ? category_id : undefined,
        },
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
                  current_position: true,
                  current_province: true,
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
                  alumni_profiles: {
                    select: {
                      id: true,
                      admit_year: true,
                      current_position: true,
                      current_province: true,
                    },
                  },
                },
              },
            },
          },
          discussion_likes: {
            select: {
              id: true,
              user_id: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
    ]);

    const dataMap = data.map((topic) => {
      const isLiked = topic.discussion_likes?.some(
        (like: any) => like.user_id === user_id
      );
      return { ...topic, isLiked: isLiked };
    });

    return NextResponse.json({ data: dataMap });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

// POST: Create a new discussion topic
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category_id, user_id, image } = body;
    if (!content || !category_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const topic = await prisma.discussion_topics.create({
      data: {
        title: title ?? null,
        content,
        category_id,
        user_id,
        image,
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
