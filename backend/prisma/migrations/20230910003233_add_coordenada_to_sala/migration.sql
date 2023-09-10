/*
  Warnings:

  - Added the required column `coordenada_x` to the `salas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordenada_y` to the `salas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "salas" ADD COLUMN     "coordenada_x" TEXT NOT NULL,
ADD COLUMN     "coordenada_y" TEXT NOT NULL;
