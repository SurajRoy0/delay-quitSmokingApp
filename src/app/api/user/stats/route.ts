import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { formatDurationMinutes } from "@/lib/format";
import { differenceInDays, differenceInMinutes } from "date-fns";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [stats, user, activeSession] = await Promise.all([
      prisma.userStats.findUnique({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.gapSession.findFirst({
        where: { userId, status: "ACTIVE" },
        orderBy: { startedAt: "desc" },
      }),
    ]);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const currencySymbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const currencySymbol = currencySymbols[user.currency] || "₹";

    if (!stats) {
      return NextResponse.json({
        longestGap: "0m",
        longestGapMinutes: 0,
        totalSaved: 0,
        currencySymbol,
        oxygenLevel: 95,
        totalCigarettesLogged: 0,
        defaultGapTargetMinutes: user.defaultGapTargetMinutes,
        cigarettePrice: user.cigarettePrice || 20,
      });
    }

    const daysSinceJoin = Math.max(1, differenceInDays(new Date(), user.createdAt));
    const dailyCigs = user.dailyCigarettes || 10;
    const expectedSmoked = dailyCigs * daysSinceJoin;
    const avoided = Math.max(0, expectedSmoked - stats.totalCigarettesLogged);
    const saved = Math.floor(avoided * (user.cigarettePrice || 20));

    let oxygen = 95;
    if (activeSession) {
      const elapsedMinutes = differenceInMinutes(new Date(), activeSession.startedAt);
      if (elapsedMinutes > 480) oxygen = 100;
      else if (elapsedMinutes > 20) oxygen = 98;
    }

    return NextResponse.json({
      longestGap: formatDurationMinutes(stats.longestGapMinutes),
      longestGapMinutes: stats.longestGapMinutes,
      totalSaved: saved,
      currencySymbol,
      oxygenLevel: oxygen,
      totalCigarettesLogged: stats.totalCigarettesLogged,
      defaultGapTargetMinutes: user.defaultGapTargetMinutes,
      cigarettePrice: user.cigarettePrice || 20,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
