import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STAGES = ["PROSPECT", "CONTACTED", "QUALIFIED", "NURTURING", "CONVERTED", "LOST"];

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, crmStage } = body;

    if (!userId || !crmStage) {
      return NextResponse.json({ message: "userId and crmStage are required" }, { status: 400 });
    }

    if (!VALID_STAGES.includes(crmStage.toUpperCase())) {
      return NextResponse.json({ message: "Invalid CRM stage" }, { status: 400 });
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        crmStage: crmStage.toUpperCase(),
      },
    });

    // Also auto-log a CRM note about this stage transition
    await prisma.crmNote.create({
      data: {
        userId,
        adminId: (session.user as any).id,
        content: `Lead pipeline stage updated to ${crmStage.toUpperCase()}.`,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ADMIN_CRM_PUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
