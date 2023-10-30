import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

interface PlantaBaixaRequest {
  descricao: string;
  imagem: string;
  andar_id: number;
}

class CreatePlantaBaixaService {
  async execute({ descricao, imagem, andar_id }: PlantaBaixaRequest) {
    const planta_baixa = await prismaClient.plantaBaixa.create({
      data: { descricao, imagem, andar_id },
    });

    return planta_baixa;
  }
}

class GetPlantasBaixasService {
  async execute() {
    const planta_baixa = await prismaClient.plantaBaixa.findMany({
      include: { salas: true, andar: { include: { bloco: true } } },
      orderBy: { id: "desc" },
    });

    return planta_baixa;
  }
}

class GetPlantaBaixaByIdService {
  async execute(id: number) {
    const planta_baixa = await prismaClient.plantaBaixa.findUnique({
      where: { id },
      include: { salas: true, andar: { include: { bloco: true } } },
    });

    return planta_baixa;
  }
}

class UpdatePlantaBaixaService {
  async executeWithImage(
    id: number,
    descricao: string,
    imagem: string,
    andar_id: number
  ) {
    const imagem_antiga = await prismaClient.plantaBaixa.findUnique({
       where: { id },
       select: { imagem: true }
    });

    const planta_baixa = await prismaClient.plantaBaixa.update({
      where: { id },
      data: { descricao, imagem, andar_id },
    });

    fs.unlinkSync(
      path.resolve( __dirname, "..", "..", "..", "tmp", `${imagem_antiga.imagem}`)
    );

    return planta_baixa;
  }

  async executeWithoutImage(id: number, descricao: string, andar_id: number) {
    const planta_baixa = await prismaClient.plantaBaixa.update({
      where: { id },
      data: { descricao, andar_id },
    });

    return planta_baixa;
  }
}

class DeletePlantaBaixaService {
  async execute(id: number) {
    const planta_baixa = await prismaClient.plantaBaixa.delete({
      where: { id },
    });

    fs.unlinkSync(
      path.resolve(__dirname, "..", "..", "..", "tmp", `${planta_baixa.imagem}`)
    );

    return planta_baixa;
  }
}

export {
  CreatePlantaBaixaService,
  GetPlantasBaixasService,
  GetPlantaBaixaByIdService,
  UpdatePlantaBaixaService,
  DeletePlantaBaixaService,
};
