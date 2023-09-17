/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `_GamePlayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "_GamePlayers" DROP CONSTRAINT "_GamePlayers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GamePlayers" DROP CONSTRAINT "_GamePlayers_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "creatorId",
ALTER COLUMN "currentRound" SET DEFAULT 0;

-- DropTable
DROP TABLE "_GamePlayers";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
