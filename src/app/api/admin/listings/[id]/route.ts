import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status } = body; // PUBLISHED or REJECTED

    if (!["PUBLISHED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const updatedListing = await prisma.startupListing.update({
      where: { id: listingId },
      data: { status },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("[ADMIN_LISTING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
