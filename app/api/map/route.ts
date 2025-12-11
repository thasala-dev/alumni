import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProvincePositions } from "@/data/thailand-province";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const show = searchParams.get("show");
  try {
    // Get province counts
    const provinceCounts = await prisma.alumni_profiles.groupBy({
      where: {
        current_province: {
          not: null,
        },
      },
      by: ["current_province"],
      _count: {
        id: true,
      },
    });

    // Get all alumni with province data in one query
    const allAlumni = await prisma.alumni_profiles.findMany({
      where: {
        current_province: {
          not: null,
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        current_company: true,
        current_position: true,
        current_province: true,
        latitude: true,
        longitude: true,
        profile_image_url: true,
      },
    });

    // Group alumni by province
    const alumniByProvince = allAlumni.reduce((acc, alumni) => {
      const provinceCode = alumni.current_province;
      if (!acc[provinceCode!]) {
        acc[provinceCode!] = [];
      }
      acc[provinceCode!].push(alumni);
      return acc;
    }, {} as Record<string, typeof allAlumni>);

    // Create map data
    const mapData = provinceCounts.map((item) => ({
      provinceCode: item.current_province,
      name: item.current_province
        ? ProvincePositions[
          item.current_province as keyof typeof ProvincePositions
        ]?.name || item.current_province
        : "",
      count: item._count.id,
      ...(show === "alumni" && {
        alumni: alumniByProvince[item.current_province!] || [],
      }),
    }));

    return NextResponse.json(mapData);
  } catch (error) {
    console.error("Error fetching map data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
