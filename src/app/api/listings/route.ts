import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingSchema, ListingInput } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role: string };
    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json({ message: "Only sellers can create listings" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData: ListingInput = listingSchema.parse(body);

    // Fetch system pricing settings
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

    if (isEnabled) {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return NextResponse.json(
          { message: "Monetization active: Payment details are required to complete listing submission." },
          { status: 400 }
        );
      }

      // Verify signature
      const crypto = await import("crypto");
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json(
          { message: "Payment verification failed. Invalid signature." },
          { status: 400 }
        );
      }

      // Record the payment
      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: chargeAmount,
          currency: "INR",
          provider: "RAZORPAY",
          providerId: razorpay_payment_id,
          status: "success",
          type: "listing_fee",
        },
      });
    }

    const listing = await prisma.startupListing.create({
      data: {
        ...validatedData,
        sellerId: user.id,
        status: "PENDING_APPROVAL",
        tagline: validatedData.tagline || null,
        country: validatedData.country || null,
        foundedYear: validatedData.foundedYear || null,
        businessModel: validatedData.businessModel || null,
        usp: validatedData.usp || null,
        reasonForSelling: validatedData.reasonForSelling || null,
        website: validatedData.website || null,
        customerCount: validatedData.customerCount || null,
        traffic: validatedData.traffic || null,
        assetsIncluded: validatedData.assetsIncluded || null,
        profit: validatedData.profit || 0,
      },
    });

    return NextResponse.json(listing);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: (error as { errors?: unknown }).errors }, { status: 400 });
    }
    console.error("[LISTINGS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    const listings = await prisma.startupListing.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { [sortBy]: sortOrder },
      ],
      include: {
        seller: {
          select: {
            name: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
