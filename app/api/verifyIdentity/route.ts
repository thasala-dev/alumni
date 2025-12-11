import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();

  const alumni = await prisma.alumni_profiles.findFirst({
    where: {
      citizenid: data.nationalId,
      birthdate: new Date(data.birthDate),
      user_id: null,
    },
  });

  return NextResponse.json({ alumni, data });
}

export async function PUT(req: Request) {
  const data = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      id: data.user_id,
    },
  });

  if (user && user.status === "UNREGISTERED") {
    const alumni = await prisma.alumni_profiles.update({
      where: {
        id: data.id,
      },
      data: {
        user_id: data.user_id,
        profile_image_url: data.profile_image_url,
      },
    });

    const userUpdate = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: "PENDING_APPROVAL",
        name: alumni.first_name + " " + alumni.last_name,
      },
    });

    return NextResponse.json(userUpdate);
  }

  return NextResponse.json(user);
}
