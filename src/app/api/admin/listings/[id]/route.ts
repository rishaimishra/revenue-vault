import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@prisma/client"; // 1. Import the generated Prisma Enum

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, rejectionReason } = body;

    // 2. Safely validate against the explicit Enum values instead of loose strings
    if (status !== ListingStatus.PUBLISHED && status !== ListingStatus.REJECTED) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // 3. Update the database using the strict Enum type
    const updatedListing = await prisma.startupListing.update({
      where: { id: listingId },
      data: { 
        status: status as ListingStatus, 
        rejectionReason: status === ListingStatus.REJECTED ? rejectionReason : null 
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("[ADMIN_LISTING_PATCH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}