/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "host" BOOLEAN DEFAULT false,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "gameId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "claimed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Game_inviteCode_key" ON "Game"("inviteCode");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
