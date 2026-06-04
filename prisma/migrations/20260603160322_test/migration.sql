-- CreateEnum
CREATE TYPE "SmokingReason" AS ENUM ('STRESS', 'WORK', 'THINKING', 'BOREDOM', 'SOCIAL', 'HABIT', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GapStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'BROKEN');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD', 'EUR', 'GBP');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "dailyCigarettes" INTEGER,
    "cigarettePrice" DOUBLE PRECISION DEFAULT 20,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "defaultGapTargetMinutes" INTEGER NOT NULL DEFAULT 240,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "userId" TEXT NOT NULL,
    "longestGapMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalCigarettesLogged" INTEGER NOT NULL DEFAULT 0,
    "totalCravingsResisted" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SmokeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "smokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" "SmokingReason",
    "notes" TEXT,
    "gapMinutes" INTEGER,
    "previousLogId" TEXT,
    "endedGapSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmokeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetMinutes" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "startedBySmokeLogId" TEXT,
    "endedAt" TIMESTAMP(3),
    "actualMinutes" INTEGER,
    "status" "GapStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GapSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CravingEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" "SmokingReason",
    "resisted" BOOLEAN NOT NULL DEFAULT false,
    "smokeLogId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CravingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerCustomerId" TEXT,
    "planId" TEXT,
    "providerPlanId" TEXT,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SmokeLog_previousLogId_key" ON "SmokeLog"("previousLogId");

-- CreateIndex
CREATE UNIQUE INDEX "SmokeLog_endedGapSessionId_key" ON "SmokeLog"("endedGapSessionId");

-- CreateIndex
CREATE INDEX "SmokeLog_userId_smokedAt_idx" ON "SmokeLog"("userId", "smokedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "GapSession_startedBySmokeLogId_key" ON "GapSession"("startedBySmokeLogId");

-- CreateIndex
CREATE INDEX "GapSession_userId_startedAt_idx" ON "GapSession"("userId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "GapSession_userId_status_idx" ON "GapSession"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CravingEvent_smokeLogId_key" ON "CravingEvent"("smokeLogId");

-- CreateIndex
CREATE INDEX "CravingEvent_userId_createdAt_idx" ON "CravingEvent"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "CravingEvent_userId_resisted_idx" ON "CravingEvent"("userId", "resisted");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokeLog" ADD CONSTRAINT "SmokeLog_previousLogId_fkey" FOREIGN KEY ("previousLogId") REFERENCES "SmokeLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokeLog" ADD CONSTRAINT "SmokeLog_endedGapSessionId_fkey" FOREIGN KEY ("endedGapSessionId") REFERENCES "GapSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokeLog" ADD CONSTRAINT "SmokeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapSession" ADD CONSTRAINT "GapSession_startedBySmokeLogId_fkey" FOREIGN KEY ("startedBySmokeLogId") REFERENCES "SmokeLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapSession" ADD CONSTRAINT "GapSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CravingEvent" ADD CONSTRAINT "CravingEvent_smokeLogId_fkey" FOREIGN KEY ("smokeLogId") REFERENCES "SmokeLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CravingEvent" ADD CONSTRAINT "CravingEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
