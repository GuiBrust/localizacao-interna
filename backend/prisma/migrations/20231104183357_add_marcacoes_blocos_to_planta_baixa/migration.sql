/*
  Warnings:

  - Added the required column `marcacoesBloco` to the `plantas_baixas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plantas_baixas" ADD COLUMN     "marcacoesBloco" TEXT;
