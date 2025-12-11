import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/alumniProfile - get all alumni profiles or by id
export async function GET(req: Request) {
  const discussion = await prisma.discussion_topics.groupBy({
    where: {
      category_id: {
        in: ["1", "2", "3", "4", "5"],
      },
    },
    by: ["category_id"],
    _count: {
      id: true,
    },
  });

  return NextResponse.json({
    "1": discussion.find((d) => d.category_id === "1")?._count.id || 0,
    "2": discussion.find((d) => d.category_id === "2")?._count.id || 0,
    "3": discussion.find((d) => d.category_id === "3")?._count.id || 0,
    "4": discussion.find((d) => d.category_id === "4")?._count.id || 0,
    "5": discussion.find((d) => d.category_id === "5")?._count.id || 0,
  });
}
