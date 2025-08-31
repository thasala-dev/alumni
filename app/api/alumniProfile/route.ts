import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/alumniProfile - get all alumni profiles or by id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const user_id = searchParams.get("user_id");
  if (id) {
    const profile = await prisma.alumni_profiles.findUnique({ where: { id } });
    if (!profile)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(profile);
  }
  if (user_id) {
    const profile = await prisma.alumni_profiles.findFirst({
      where: { user_id: user_id },
    });
    if (!profile)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(profile);
  }
  const profiles = await prisma.alumni_profiles.findMany({
    orderBy: { studentcode: "desc" },
  });
  return NextResponse.json(profiles);
}

// POST /api/alumniProfile - create alumni profile
export async function POST(req: Request) {
  const data = await req.json();
  const profile = await prisma.alumni_profiles.create({
    data,
  });
  return NextResponse.json(profile);
}

// PUT /api/alumniProfile - update alumni profile (by id)
export async function PUT(req: Request) {
  const data = await req.json();
  if (!data.id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const profile = await prisma.alumni_profiles.update({
    where: { id: data.id },
    data,
  });
  return NextResponse.json(profile);
}
