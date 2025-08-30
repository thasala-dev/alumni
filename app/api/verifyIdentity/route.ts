import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const alumni = await prisma.alumni_profiles.findFirst({
    where: {
      // citizenid: data.nationalId,
      birthdate: new Date(data.birthDate),
    },
  });

  return NextResponse.json({ alumni, data });
}

export async function PUT(req: Request) {
  const data = await req.json();

  return NextResponse.json(data);
}
