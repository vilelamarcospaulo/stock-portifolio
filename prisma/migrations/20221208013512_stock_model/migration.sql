/*
  Warnings:

  - Added the required column `score` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('FII', 'STOCk', 'ETF');

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "score" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "type" "StockType" NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);
