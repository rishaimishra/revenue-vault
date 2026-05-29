import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause: Record<string, unknown> = {};
    if (status) {
      whereClause.status = status;
    }

    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true, image: true }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
