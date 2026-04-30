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
    const { listingId, reason } = body;

    if (!listingId || !reason) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        listingId,
        reason,
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORTS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
