import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify listing exists and user is the owner
    const listing = await prisma.startupListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    if (listing.sellerId !== (session.user as any).id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Simulate Payment logic here (in real app, call Stripe/Razorpay)
    // We already have a generic /api/payments, but this is a specific shortcut for MVP

    const updatedListing = await prisma.startupListing.update({
      where: { id: listingId },
      data: { isFeatured: true },
    });

    // Record the payment
    const payment = await prisma.payment.create({
      data: {
        userId: (session.user as any).id,
        amount: 29.00, // Featured listing fee
        currency: "USD",
        provider: "SIMULATED",
        providerId: `feat_${Math.random().toString(36).substring(7)}`,
        status: "success",
        type: "featured_listing",
      },
    });

    // Send invoice email in the background
    sendInvoiceEmail(payment.id).catch((err) => {
      console.error("[EMAIL_ERROR] Failed to send payment invoice for featured listing:", err);
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("[FEATURE_LISTING_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
