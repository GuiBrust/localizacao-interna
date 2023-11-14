import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

interface PlantaBaixaRequest {
  descricao: string;
  imagem: string;
  andar_id: number | null;
  marcacoesBloco: string;
}

class CreatePlantaBaixaService {
  async execute({ descricao, imagem, andar_id, marcacoesBloco }: PlantaBaixaRequest) {
    const data = {
      descricao,
      imagem,
      andar_id: andar_id || null,
      marcacoesBloco: marcacoesBloco || null,
    };

    const planta_baixa = await prismaClient.plantaBaixa.create({data});

    return planta_baixa;
  }
}

class GetPlantasBaixasService {
  async execute() {
    const planta_baixa = await prismaClient.plantaBaixa.findMany({
      where: { andar_id: { not: null } },
      include: { salas: true, andar: { include: { bloco: true } } },
      orderBy: { id: "desc" },
    });

    return planta_baixa;
  }
}

class GetBlocoPlantasBaixasService {
  async execute() {
    const planta_baixa = await prismaClient.plantaBaixa.findFirst({
      where: { andar_id: null },
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
    andar_id: number,
    marcacoesBloco: string
  ) {
    const imagem_antiga = await prismaClient.plantaBaixa.findUnique({
       where: { id },
       select: { imagem: true }
    });

    const planta_baixa = await prismaClient.plantaBaixa.update({
      where: { id },
      data: { descricao, imagem, andar_id, marcacoesBloco },
    });

    fs.unlinkSync(
      path.resolve( __dirname, "..", "..", "..", "tmp", `${imagem_antiga.imagem}`)
    );

    return planta_baixa;
  }

  async executeWithoutImage(id: number, descricao: string, andar_id: number, marcacoesBloco: string) {
    const planta_baixa = await prismaClient.plantaBaixa.update({
      where: { id },
      data: { descricao, andar_id, marcacoesBloco },
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
  GetBlocoPlantasBaixasService,
  GetPlantaBaixaByIdService,
  UpdatePlantaBaixaService,
  DeletePlantaBaixaService,
};
