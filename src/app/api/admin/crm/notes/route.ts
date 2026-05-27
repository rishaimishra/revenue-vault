import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crmNoteSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json({ message: "userId and content are required" }, { status: 400 });
    }

    const validation = crmNoteSchema.safeParse({ content });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.format() },
        { status: 400 }
      );
    }

    // Check if user exists
    const contactUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!contactUser) {
      return NextResponse.json({ message: "Contact user not found" }, { status: 404 });
    }

    const newNote = await prisma.crmNote.create({
      data: {
        userId,
        adminId: (session.user as any).id,
        content: validation.data.content,
      },
      include: {
        admin: { select: { name: true } },
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_CRM_NOTES_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
