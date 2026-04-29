import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const listingId = params.id;

    // Check if listing exists
    const listing = await prisma.startupListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Don't allow seller to request access to their own listing
    if (listing.sellerId === session.user.id) {
      return new NextResponse("You cannot request access to your own listing", { status: 400 });
    }

    // Create access request
    const accessRequest = await prisma.accessRequest.upsert({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId: session.user.id,
        },
      },
      update: {},
      create: {
        listingId,
        buyerId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(accessRequest);
  } catch (error) {
    console.error("[ACCESS_REQUEST_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
