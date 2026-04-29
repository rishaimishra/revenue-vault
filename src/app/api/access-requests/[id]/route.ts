import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Check if request exists and if the current user is the seller of the listing
    const accessRequest = await prisma.accessRequest.findUnique({
      where: { id: requestId },
      include: {
        listing: {
          select: {
            sellerId: true,
            id: true,
          }
        }
      }
    });

    if (!accessRequest) {
      return new NextResponse("Request not found", { status: 404 });
    }

    if (accessRequest.listing.sellerId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Update status
    const updatedRequest = await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // If approved, create a Deal to start the conversation
    if (status === "APPROVED") {
      await prisma.deal.upsert({
        where: {
          // I don't have a unique constraint on Deal for listing+buyer yet, but it's good practice
          // For MVP, I'll just create or find
          id: `${accessRequest.listingId}-${accessRequest.buyerId}` // Custom ID for unique mapping
        },
        update: {
          status: "ACCEPTED",
        },
        create: {
          id: `${accessRequest.listingId}-${accessRequest.buyerId}`,
          listingId: accessRequest.listingId,
          buyerId: accessRequest.buyerId,
          status: "ACCEPTED",
        },
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("[ACCESS_REQUEST_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
