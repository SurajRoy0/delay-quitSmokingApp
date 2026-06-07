import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { formatDurationMinutes } from "@/lib/format";
import { format } from "date-fns";
import { rawMinuteOptions } from "@/components/duration-picker";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const joinDate = format(user.createdAt, "MMM yyyy");
    const currencySymbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const currencySymbol = currencySymbols[user.currency] || "₹";

    return NextResponse.json({
      name: user.name || "User",
      memberSince: joinDate,
      premium: user.subscription?.status === "ACTIVE",
      avatar: user.image,
      smokingProfile: {
        dailyCigarettes: user.dailyCigarettes || 10,
        pricePerCigarette: user.cigarettePrice || 20,
        currencySymbol,
        gapTarget: formatDurationMinutes(user.defaultGapTargetMinutes),
        currency: user.currency,
        defaultGapTargetMinutes: user.defaultGapTargetMinutes,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dailyCigarettes, cigarettePrice, currency, defaultGapTargetMinutes } = await req.json();

    const minGap = rawMinuteOptions[0];

    if (
      dailyCigarettes < 1 ||
      dailyCigarettes > 200 ||
      cigarettePrice <= 0 ||
      defaultGapTargetMinutes < minGap
    ) {
      return NextResponse.json({ error: "Invalid data. Please check your inputs." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyCigarettes,
        cigarettePrice,
        currency,
        defaultGapTargetMinutes,
      },
    });

    // Also update active session's target minutes to align with the new default
    const activeSession = await prisma.gapSession.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { startedAt: "desc" },
    });

    if (activeSession) {
      await prisma.gapSession.update({
        where: { id: activeSession.id },
        data: { targetMinutes: defaultGapTargetMinutes },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
