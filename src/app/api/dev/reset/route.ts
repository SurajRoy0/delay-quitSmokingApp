import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  return handleReset(request);
}

export async function POST(request: Request) {
  return handleReset(request);
}

async function handleReset(request: Request) {
  // Only allow in development mode or if a valid secret matches process.env.DEV_RESET_SECRET
  const isDev = process.env.NODE_ENV === "development";
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const action = searchParams.get("action") || "clean"; // "clean" or "nuke"
  const confirm = searchParams.get("confirm") === "true";

  const devSecret = process.env.DEV_RESET_SECRET;

  if (!isDev && (!devSecret || secret !== devSecret)) {
    return NextResponse.json(
      { error: "Unauthorized. Dev reset is only allowed in development or with a valid secret key." },
      { status: 403 }
    );
  }

  if (!confirm) {
    return NextResponse.json(
      {
        error: "Action requires confirmation.",
        message: "Please append '&confirm=true' to the URL to confirm database reset.",
        availableActions: {
          clean: "Resets all stats, logs, craving events, and onboarding status for all users, but keeps user accounts and sessions.",
          nuke: "Wipes the entire database (Users, Accounts, Sessions, Subscriptions, and all tracking data) completely."
        },
        examples: {
          clean: `/api/dev/reset?action=clean&confirm=true`,
          nuke: `/api/dev/reset?action=nuke&confirm=true`
        }
      },
      { status: 400 }
    );
  }

  try {
    if (action === "nuke") {
      // Complete wipe of all tables
      await prisma.$transaction([
        prisma.subscription.deleteMany(),
        // Due to foreign keys and self-referential relations, we delete gap sessions first,
        // then clear previousLogId chains on SmokeLog, delete smoke logs, then delete accounts/sessions/users
        prisma.gapSession.deleteMany(),
        prisma.smokeLog.updateMany({
          data: { previousLogId: null }
        }),
        prisma.smokeLog.deleteMany(),
        prisma.userStats.deleteMany(),
        prisma.session.deleteMany(),
        prisma.account.deleteMany(),
        prisma.user.deleteMany(),
        prisma.verification.deleteMany(),
      ]);

      return NextResponse.json({
        success: true,
        action: "nuke",
        message: "Database wiped completely. All tables have been cleared."
      });
    } else {
      // clean: resets all logs, stats, and onboarding status, but preserves users/accounts
      await prisma.$transaction([
        prisma.gapSession.deleteMany(),
        prisma.smokeLog.updateMany({
          data: { previousLogId: null }
        }),
        prisma.smokeLog.deleteMany(),
        prisma.userStats.updateMany({
          data: {
            longestGapMinutes: 0,
            totalCigarettesLogged: 0,
            totalCravingsResisted: 0,
          }
        }),
        prisma.user.updateMany({
          data: {
            onboardingCompleted: false,
            dailyCigarettes: null,
            cigarettePrice: null,
            defaultGapTargetMinutes: 240,
          }
        }),
      ]);

      return NextResponse.json({
        success: true,
        action: "clean",
        message: "Database cleaned. All stats, logs, gap sessions, craving events, and onboarding states have been reset. User logins remain intact."
      });
    }
  } catch (error: any) {
    console.error("DB Reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset database", details: error.message },
      { status: 500 }
    );
  }
}
