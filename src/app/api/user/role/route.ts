import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!["BUYER", "SELLER"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { 
        role,
        isOnboarded: true
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_ROLE_PATCH]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
