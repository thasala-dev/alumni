import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/sync-alumni
// Body: { userId, alumniProfileId }
export async function POST(req: Request) {
  const { userId, alumniProfileId } = await req.json();

  if (!userId || !alumniProfileId) {
    return NextResponse.json({ error: "Missing userId or alumniProfileId" }, { status: 400 });
  }

  // Verify the profile is still unlinked
  const profile = await prisma.alumni_profiles.findUnique({
    where: { id: alumniProfileId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Alumni profile not found" }, { status: 404 });
  }

  if (profile.user_id !== null) {
    return NextResponse.json({ error: "Alumni profile is already linked to another user" }, { status: 409 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Link profile to user
  await prisma.alumni_profiles.update({
    where: { id: alumniProfileId },
    data: { user_id: userId },
  });

  // Update user name and bump status from UNREGISTERED → PENDING_APPROVAL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || user.name,
      ...(user.status === "UNREGISTERED" && { status: "PENDING_APPROVAL" }),
    },
    include: { alumni_profiles: true },
  });

  return NextResponse.json(updatedUser);
}
