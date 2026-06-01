import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    return NextResponse.json({
      enabled: isEnabled,
      amount: chargeAmount,
    });
  } catch (error) {
    console.error("[PRICING_INFO_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
