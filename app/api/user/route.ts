import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
