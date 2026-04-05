-- CreateEnum
CREATE TYPE "FocusSection" AS ENUM ('MATH', 'READING_WRITING');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "firstName" TEXT NOT NULL DEFAULT '',
    "targetScore" INTEGER NOT NULL DEFAULT 1400,
    "targetTestDate" TIMESTAMP(3),
    "preferredDailyMinutes" INTEGER NOT NULL DEFAULT 20,
    "focusSection" "FocusSection" NOT NULL DEFAULT 'MATH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyProgress" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "completedDays" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userProfileId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "StudyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgress_userProfileId_key" ON "StudyProgress"("userProfileId");

-- AddForeignKey
ALTER TABLE "StudyProgress" ADD CONSTRAINT "StudyProgress_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
