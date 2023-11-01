/*
  Warnings:

  - A unique constraint covering the columns `[planta_baixa_id,numero]` on the table `salas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero` to the `salas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "salas" ADD COLUMN     "numero" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "salas_planta_baixa_id_numero_key" ON "salas"("planta_baixa_id", "numero");
