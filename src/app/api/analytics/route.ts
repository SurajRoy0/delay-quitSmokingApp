import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SmokingReason } from "@/generated/prisma/client";
import { getAuthenticatedUserId } from "@/lib/server-utils";
import { subDays, subHours, startOfDay, endOfDay, format } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get("days");
    const reasonParam = searchParams.get("reason");
    const daysToLookBack = daysParam ? parseInt(daysParam, 10) : 30;
    
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();
    const twentyFourHoursAgo = subHours(now, 24);
    const historicalStartDate = subDays(now, daysToLookBack);

    // Fetch 24-hour logs
    const last24hLogs = await prisma.smokeLog.findMany({
      where: {
        userId,
        smokedAt: { gte: twentyFourHoursAgo },
        ...(reasonParam && reasonParam !== "ALL" ? { reasons: { has: reasonParam as SmokingReason } } : {}),
      },
      select: { gapMinutes: true, price: true, reasons: true },
    });

    const count24h = last24hLogs.length;
    const spent24h = last24hLogs.reduce((sum, log) => sum + (log.price || 0), 0);
    const avgGap24h = count24h > 0 
      ? Math.round(last24hLogs.reduce((sum, log) => sum + (log.gapMinutes || 0), 0) / count24h)
      : 0;

    const reasons24hMap = new Map<string, number>();
    last24hLogs.forEach(log => {
      log.reasons.forEach(r => {
        reasons24hMap.set(r, (reasons24hMap.get(r) || 0) + 1);
      });
    });
    const triggers24h = Array.from(reasons24hMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Fetch historical logs for chart
    const historicalLogs = await prisma.smokeLog.findMany({
      where: {
        userId,
        smokedAt: { gte: historicalStartDate },
        ...(reasonParam && reasonParam !== "ALL" ? { reasons: { has: reasonParam as SmokingReason } } : {}),
      },
      select: { smokedAt: true, price: true, reasons: true },
      orderBy: { smokedAt: "asc" },
    });

    // Group historical logs by day
    const dailyDataMap = new Map<string, { date: string, count: number, spent: number }>();
    
    // Initialize days with 0
    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const d = subDays(now, i);
      const dateStr = format(d, "MMM dd");
      dailyDataMap.set(dateStr, { date: dateStr, count: 0, spent: 0 });
    }

    const reasons30dMap = new Map<string, number>();

    historicalLogs.forEach(log => {
      const dateStr = format(log.smokedAt, "MMM dd");
      if (dailyDataMap.has(dateStr)) {
        const entry = dailyDataMap.get(dateStr)!;
        entry.count += 1;
        entry.spent += (log.price || 0);
      }
      
      log.reasons.forEach(r => {
        reasons30dMap.set(r, (reasons30dMap.get(r) || 0) + 1);
      });
    });

    const historicalData = Array.from(dailyDataMap.values());
    const triggers30d = Array.from(reasons30dMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Overall stats
    const stats = await prisma.userStats.findUnique({ where: { userId } });
    
    return NextResponse.json({
      currencySymbol: user.currency === "USD" ? "$" : user.currency === "EUR" ? "€" : user.currency === "GBP" ? "£" : "₹",
      last24h: {
        count: count24h,
        spent: spent24h,
        avgGapMinutes: avgGap24h,
        triggers: triggers24h,
      },
      historical: historicalData,
      triggers30d,
      overall: {
        totalLogged: stats?.totalCigarettesLogged || 0,
        longestGapMinutes: stats?.longestGapMinutes || 0,
      }
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
