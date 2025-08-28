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

// POST /api/user - create user
export async function POST(req: Request) {
  const data = await req.json();
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      name: data.name,
      avatar: data.avatar,
      image: data.image,
      role: data.role || "alumni",
      status: data.status || "UNREGISTERED",
    },
  });
  return NextResponse.json(user);
}
