import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/alumniProfile - get all alumni profiles or by id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const [alumni, discussion, news, latestNews] = await Promise.all([
    prisma.alumni_profiles.count({}),
    prisma.discussion_topics.count({
      where: {
        category_id: {
          not: {
            in: ["0", "99"],
          },
        },
      },
    }),
    prisma.discussion_topics.count({
      where: {
        category_id: "99",
      },
    }),
    prisma.discussion_topics.findMany({
      where: {
        category_id: "99",
      },
      orderBy: {
        created_at: "desc",
      },
      take: 6,
    }),
  ]);

  const province = 56;
  return NextResponse.json({
    stat: {
      alumni,
      discussion,
      news,
      province,
    },
    latestNews,
  });
}
