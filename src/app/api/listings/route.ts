import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // @ts-ignore
    if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
      return new NextResponse("Only sellers can create listings", { status: 403 });
    }

    const body = await req.json();
    const validatedData = listingSchema.parse(body);

    const listing = await prisma.startupListing.create({
      data: {
        ...validatedData,
        sellerId: session.user.id,
        status: "PENDING_APPROVAL", // MVP requirement: Listing approval before publishing
      },
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    console.error("[LISTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: any = {
      status: "PUBLISHED", // Only show approved listings in the marketplace
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const listings = await prisma.startupListing.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        seller: {
          select: {
            name: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
