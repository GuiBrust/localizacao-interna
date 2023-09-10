/*
  Warnings:

  - Added the required column `imagem` to the `plantas_baixas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plantas_baixas" ADD COLUMN     "imagem" TEXT NOT NULL;
