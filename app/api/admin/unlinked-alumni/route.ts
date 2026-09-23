import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/unlinked-alumni?q=...
// Returns alumni_profiles where user_id is null, optionally filtered by search query
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  const profiles = await prisma.alumni_profiles.findMany({
    where: {
      user_id: null,
      ...(q && {
        OR: [
          { first_name: { contains: q, mode: "insensitive" } },
          { last_name: { contains: q, mode: "insensitive" } },
          { studentcode: { contains: q, mode: "insensitive" } },
          { citizenid: { contains: q } },
        ],
      }),
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      studentcode: true,
      admit_year: true,
      programname: true,
      citizenid: true,
      profile_image_url: true,
    },
    orderBy: { studentcode: "desc" },
    take: 30,
  });

  return NextResponse.json(profiles);
}
