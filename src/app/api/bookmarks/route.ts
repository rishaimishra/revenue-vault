import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ message: "Listing ID required" }, { status: 400 });
    }

    // Toggle bookmark
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_listingId: {
          userId: (session.user as any).id,
          listingId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: (session.user as any).id,
          listingId,
        },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("[BOOKMARKS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: (session.user as any).id },
      include: {
        listing: {
          include: {
            seller: {
              select: { name: true, isVerified: true }
            }
          }
        }
      }
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("[BOOKMARKS_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
