import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: (session.user as any).id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: true,
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, priority, initialMessage } = body;

    if (!subject || !initialMessage) {
      return NextResponse.json(
        { error: "Subject and initial message are required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: (session.user as any).id,
        subject,
        priority: priority || "MEDIUM",
        messages: {
          create: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            senderId: (session.user as any).id,
            content: initialMessage,
          }
        }
      },
      include: {
        messages: true
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
