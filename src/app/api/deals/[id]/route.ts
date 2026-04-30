import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dealId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    // Verify deal exists and user is the seller
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        listing: {
          select: { sellerId: true }
        }
      }
    });

    if (!deal) {
      return NextResponse.json({ message: "Deal not found" }, { status: 404 });
    }

    if (deal.listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: { status },
    });

    // If deal is closed, mark the listing as SOLD
    if (status === "CLOSED") {
      await prisma.startupListing.update({
        where: { id: deal.listingId },
        data: { status: "SOLD" }
      });
    }

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error("[DEAL_PATCH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
