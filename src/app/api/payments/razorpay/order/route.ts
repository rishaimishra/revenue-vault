import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch system pricing settings
    const settingsList = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ["listing_charge_enabled", "listing_charge_amount"],
        },
      },
    });

    const settings = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const isEnabled = settings.listing_charge_enabled === "true";
    const chargeAmount = parseInt(settings.listing_charge_amount || "500", 10);

    // 2. If listings are currently free, return disabled
    if (!isEnabled) {
      return NextResponse.json({ enabled: false });
    }

    // 3. Initialize Razorpay Client
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("[RAZORPAY_ORDER_POST] Missing Razorpay Key configurations in env");
      return NextResponse.json(
        { message: "Payment Gateway configuration error" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // 4. Create an order with amount in paise (amount * 100)
    const amountInPaise = chargeAmount * 100;
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Math.random().toString(36).substring(2, 15)}`,
    });

    return NextResponse.json({
      enabled: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id, // Send public key to load in client checkout
    });
  } catch (error) {
    console.error("[RAZORPAY_ORDER_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
