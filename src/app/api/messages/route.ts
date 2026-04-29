import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, dealId, receiverId } = body;

    if (!content || !dealId || !receiverId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Verify deal exists and user is part of it
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        listing: {
          select: { sellerId: true }
        }
      }
    });

    if (!deal) {
      return new NextResponse("Deal not found", { status: 404 });
    }

    const isSeller = deal.listing.sellerId === (session.user as any).id;
    const isBuyer = deal.buyerId === (session.user as any).id;

    if (!isSeller && !isBuyer) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: (session.user as any).id,
        receiverId,
        dealId,
      },
    });

    // Update deal updatedAt timestamp
    await prisma.deal.update({
      where: { id: dealId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get("dealId");

    if (!dealId) {
      return new NextResponse("Deal ID required", { status: 400 });
    }

    // Verify deal exists and user is part of it
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        listing: {
          select: { sellerId: true }
        }
      }
    });

    if (!deal) {
      return new NextResponse("Deal not found", { status: 404 });
    }

    if (deal.listing.sellerId !== (session.user as any).id && deal.buyerId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { dealId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { name: true, image: true }
        }
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
