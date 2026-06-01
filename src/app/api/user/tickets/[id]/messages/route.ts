import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ticketId } = await params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          include: {
            sender: {
              select: { name: true, image: true, role: true }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Allow admins to view any ticket
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ticket.userId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Allow admins to reply to any ticket
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ticket.userId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Add message
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        senderId: (session.user as any).id,
        content,
      },
      include: {
        sender: {
          select: { name: true, image: true, role: true }
        }
      }
    });

    // Update ticket status to OPEN if a user replied to an admin,
    // or IN_PROGRESS if admin replied to a user.
    // Also update updatedAt.
    let newStatus = ticket.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any).role === "ADMIN" && ticket.status === "OPEN") {
      newStatus = "IN_PROGRESS";
    }

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { 
        status: newStatus,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error adding message to ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
