import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, type, tier } = body;

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Record the payment
    const payment = await prisma.payment.create({
      data: {
        userId: (session.user as any).id,
        amount,
        currency: "USD",
        provider: "SIMULATED",
        providerId: `sim_${Math.random().toString(36).substring(7)}`,
        status: "success",
        type,
      },
    });

    // Send invoice email in the background
    sendInvoiceEmail(payment.id).catch((err) => {
      console.error("[EMAIL_ERROR] Failed to send subscription payment invoice:", err);
    });

    // If it's a subscription, update user's status
    if (type === "subscription") {
      await prisma.user.update({
        where: { id: (session.user as any).id },
        data: {
          isSubscribed: true,
          subscriptionTier: tier || "PRO",
        },
      });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("[PAYMENTS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
