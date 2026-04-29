import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // MVP Simple Check: In a real app, check user.role === 'ADMIN'
    // For now, I'll assume the session user must be checked against a specific email or role
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const listingId = params.id;
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
