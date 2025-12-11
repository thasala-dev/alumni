import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/user - get all users
export async function GET() {
  const users = await prisma.User.findMany({
    include: {
      alumni_profiles: true,
    },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(users);
}
