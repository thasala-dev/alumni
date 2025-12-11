import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/alumniProfile - get all alumni profiles or by id
export async function GET(req: Request) {
  const [alumni, discussion, news, latestNews, province] = await Promise.all([
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
    prisma.alumni_profiles.groupBy({
      where: {
        current_province: {
          not: null,
        },
      },
      by: ["current_province"],
    }),
  ]);

  // const province = 56;
  return NextResponse.json({
    stat: {
      alumni,
      discussion,
      news,
      province: province.length || 0,
    },
    latestNews,
  });
}
