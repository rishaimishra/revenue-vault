import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Fetch current users
    const usersBefore = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, isOnboarded: true },
    });

    // 2. Promote the target user to ADMIN
    const targetEmail = "growpos.official@gmail.com";
    const targetUser = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    let updateResult = null;
    if (targetUser) {
      updateResult = await prisma.user.update({
        where: { email: targetEmail },
        data: {
          role: "ADMIN",
          isOnboarded: true,
          isVerified: true,
        },
      });
    }

    // 3. Fetch users after update
    const usersAfter = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, isOnboarded: true },
    });

    return NextResponse.json({
      message: "Debug and promotion execution finished.",
      targetEmail,
      foundTargetUser: !!targetUser,
      targetUserBefore: targetUser,
      targetUserAfter: updateResult,
      allUsersAfter: usersAfter,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || String(error),
    }, { status: 500 });
  }
}
