import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/user - get all users
export async function GET() {
  const users = await prisma.alumni_profiles.findMany({
    select: {
      admit_year: true,
      user: {
        select: {
          status: true,
        },
      },
    },
  });

  const yearStat = [] as any[];

  let totalUsers = users.length;
  let unregistUsers = 0;

  users.map((item) => {
    // activeUsers
    const year = item.admit_year;
    if (year == null) {
      // Skip items with null or undefined admit_year
      return;
    }
    if (!yearStat.find((item: any) => item.admit_year === year)) {
      yearStat.push({
        admit_year: year,
        count: 0,
        unregistered: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
      });
    }

    yearStat.find((item: any) => item.admit_year === year)!.count++;
    if (!item.user || item.user.status === "UNREGISTERED") {
      unregistUsers++;
      yearStat.find((item: any) => item.admit_year === year)!.unregistered++;
    } else if (item.user.status === "PENDING_APPROVAL") {
      yearStat.find((item: any) => item.admit_year === year)!.pending++;
    } else if (item.user.status === "APPROVED") {
      yearStat.find((item: any) => item.admit_year === year)!.approved++;
    } else if (item.user.status === "REJECTED") {
      yearStat.find((item: any) => item.admit_year === year)!.rejected++;
    } else if (item.user.status === "SUSPENDED") {
      yearStat.find((item: any) => item.admit_year === year)!.suspended++;
    }
    return yearStat;
  });

  return NextResponse.json({
    yearStat: yearStat,
    usage: {
      active: totalUsers - unregistUsers,
      total: totalUsers,
    },
  });
}
