import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const settingsList = await prisma.systemSetting.findMany();
    const settings = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      listing_charge_enabled: settings.listing_charge_enabled === "true",
      listing_charge_amount: parseInt(settings.listing_charge_amount || "500", 10),
    });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listing_charge_enabled, listing_charge_amount } = body;

    if (typeof listing_charge_enabled !== "boolean" || typeof listing_charge_amount !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.systemSetting.upsert({
        where: { key: "listing_charge_enabled" },
        update: { value: String(listing_charge_enabled) },
        create: { key: "listing_charge_enabled", value: String(listing_charge_enabled) },
      }),
      prisma.systemSetting.upsert({
        where: { key: "listing_charge_amount" },
        update: { value: String(listing_charge_amount) },
        create: { key: "listing_charge_amount", value: String(listing_charge_amount) },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
