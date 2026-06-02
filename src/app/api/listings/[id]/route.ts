import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingSchema, ListingInput } from "@/lib/validations";
import { sendListingStatusEmail } from "@/lib/email";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.startupListing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            name: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("[LISTING_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role: string };

    // Find the listing
    const existingListing = await prisma.startupListing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Only seller or admin can edit
    if (existingListing.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData: ListingInput = listingSchema.parse(body);

    // Convert undefined to null for optional fields and handle profit
    const updateData: Record<string, unknown> = {
      ...validatedData,
      tagline: validatedData.tagline || null,
      country: validatedData.country || null,
      foundedYear: validatedData.foundedYear || null,
      businessModel: validatedData.businessModel || null,
      usp: validatedData.usp || null,
      reasonForSelling: validatedData.reasonForSelling || null,
      website: validatedData.website || null,
      customerCount: validatedData.customerCount || null,
      traffic: validatedData.traffic || null,
      assetsIncluded: validatedData.assetsIncluded || null,
      profit: validatedData.profit || 0,
    };

    if (user.role === "SELLER") {
      updateData.status = "PENDING_APPROVAL";
    }

    const updatedListing = await prisma.startupListing.update({
      where: { id },
      data: updateData,
    });

    // Send email notification in the background
    sendListingStatusEmail(
      updatedListing.id,
      updatedListing.status,
      updatedListing.rejectionReason
    ).catch((err) => {
      console.error("[EMAIL_ERROR] Failed to send status email to seller:", err);
    });

    return NextResponse.json(updatedListing);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: (error as { errors?: unknown }).errors }, { status: 400 });
    }
    console.error("[LISTING_PUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role: string };

    // Find the listing
    const existingListing = await prisma.startupListing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Only seller or admin can delete
    if (existingListing.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.startupListing.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("[LISTING_DELETE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}