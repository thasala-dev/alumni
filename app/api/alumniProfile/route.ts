import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const data = await req.json();
    if (!data.id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Remove fields that shouldn't be updated or don't exist in the schema
    const { user_id, created_at, updated_at, ...updateData } = data;

    const profile = await prisma.alumni_profiles.update({
      where: { id: data.id },
      data: updateData,
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating alumni profile:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
