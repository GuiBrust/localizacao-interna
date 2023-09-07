-- CreateTable
CREATE TABLE "blocos" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "andares" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bloco_id" INTEGER NOT NULL,

    CONSTRAINT "andares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantas_baixas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "andar_id" INTEGER NOT NULL,

    CONSTRAINT "plantas_baixas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planta_baixa_id" INTEGER NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_user_key" ON "usuarios"("user");

-- AddForeignKey
ALTER TABLE "andares" ADD CONSTRAINT "andares_bloco_id_fkey" FOREIGN KEY ("bloco_id") REFERENCES "blocos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantas_baixas" ADD CONSTRAINT "plantas_baixas_andar_id_fkey" FOREIGN KEY ("andar_id") REFERENCES "andares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salas" ADD CONSTRAINT "salas_planta_baixa_id_fkey" FOREIGN KEY ("planta_baixa_id") REFERENCES "plantas_baixas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Criar um usuário padrão
INSERT INTO "usuarios" ("nome", "user", "senha", "updatedAt") VALUES ('Administrador', 'admin', '$2a$08$BUWyl8p6eYr/xy2CAsYw3OzMddudY9EbU5Kb/WIoU6.HE0MtTzfMe', NOW());