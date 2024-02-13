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
  async execute({
    descricao,
    imagem,
    andar_id,
    marcacoesBloco,
  }: PlantaBaixaRequest) {
    const data = {
      descricao,
      imagem,
      andar_id: andar_id || null,
      marcacoesBloco: marcacoesBloco || null,
    };

    const planta_baixa = await prismaClient.plantaBaixa.create({ data });

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

async function buscarSala(salaId) {
  return await prismaClient.sala.findUnique({
    where: { id: salaId },
    include: {
      planta_baixa: { include: { andar: { include: { bloco: true } } } },
    },
  });
}

async function buscarBloco() {
  return await prismaClient.plantaBaixa.findFirst({
    where: { andar_id: null },
  });
}

async function buscaOrigemDestino(
  localizacaoId,
  localizacaoTipo,
  destinoId,
  destinoTipo
) {
  let origem, destino;
  if (localizacaoTipo === "salas") {
    origem = await buscarSala(localizacaoId);
  } else if (localizacaoTipo === "bloco") {
    origem = await buscarBloco();
  }

  if (destinoTipo === "salas") {
    destino = await buscarSala(destinoId);
  } else if (destinoTipo === "bloco") {
    destino = await buscarBloco();
  }

  return { origem, destino };
}

class GetPlantasBaixasImagensService {
  async execute(
    localizacaoId: number,
    localizacaoTipo: string,
    destinoId: number,
    destinoTipo: string
  ) {
    let { origem, destino } = await buscaOrigemDestino(
      localizacaoId,
      localizacaoTipo,
      destinoId,
      destinoTipo
    );
    let blocos_ids = [];
    let marcacoes = {};

    let retorna_duas_imagens =
      origem?.planta_baixa?.andar_id !== undefined &&
      destino?.planta_baixa?.andar_id !== undefined &&
      origem.planta_baixa.andar_id !== destino.planta_baixa.andar_id &&
      origem.planta_baixa.andar.bloco_id ===
        destino.planta_baixa.andar.bloco_id;

    if (origem?.planta_baixa_id === destino?.planta_baixa_id) {
      if (localizacaoTipo === "salas") {
        marcacoes = [
          {
            top: origem.coordenada_y,
            left: origem.coordenada_x,
            descricao: origem.descricao,
          },
          {
            top: destino.coordenada_y,
            left: destino.coordenada_x,
            descricao: destino.descricao,
          },
        ];
        origem = { ...origem.planta_baixa, marcacoes };
      } else {
        blocos_ids = [localizacaoId, destinoId];

        marcacoes = blocos_ids.map((id) =>
          JSON.parse(origem.marcacoesBloco).find(
            (marcacao) => parseInt(marcacao.bloco_id) === id
          )
        );
        origem = { ...origem, marcacoes };
      }

      return { origem };
    } else if (retorna_duas_imagens) {
      origem = {
        ...origem.planta_baixa,
        marcacoes: [
          {
            top: origem.coordenada_y,
            left: origem.coordenada_x,
            descricao: origem.descricao,
          },
        ],
      };

      destino = {
        ...destino.planta_baixa,
        marcacoes: [
          {
            top: destino.coordenada_y,
            left: destino.coordenada_x,
            descricao: destino.descricao,
          },
        ],
      };

      return { origem, destino };
    } else if (localizacaoTipo != destinoTipo) {
      if (localizacaoTipo === "bloco") {
        blocos_ids = [localizacaoId, destino.planta_baixa.andar.bloco_id];

        marcacoes = blocos_ids.map((id) =>
          JSON.parse(destino.marcacoesBloco).find(
            (marcacao) => parseInt(marcacao.bloco_id) === id
          )
        );
        origem = { ...origem, marcacoes };

        return { origem };
      } else {
        blocos_ids = [origem.planta_baixa.andar.bloco_id, destinoId];

        marcacoes = blocos_ids.map((id) =>
          JSON.parse(destino.marcacoesBloco).find(
            (marcacao) => parseInt(marcacao.bloco_id) === id
          )
        );
        destino = { ...destino, marcacoes };

        return { destino };
      }
    } else if (
      origem.planta_baixa.andar.bloco_id != destino.planta_baixa.andar.bloco_id
    ) {
      blocos_ids = [
        origem.planta_baixa.andar.bloco_id,
        destino.planta_baixa.andar.bloco_id,
      ];

      origem = await buscarBloco();

      marcacoes = blocos_ids.map((id) =>
        JSON.parse(origem.marcacoesBloco).find(
          (marcacao) => parseInt(marcacao.bloco_id) === id
        )
      );
      origem = { ...origem, marcacoes };

      return { origem };
    }
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
      select: { imagem: true },
    });

    const planta_baixa = await prismaClient.plantaBaixa.update({
      where: { id },
      data: { descricao, imagem, andar_id, marcacoesBloco },
    });

    fs.unlinkSync(
      path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "tmp",
        `${imagem_antiga.imagem}`
      )
    );

    return planta_baixa;
  }

  async executeWithoutImage(
    id: number,
    descricao: string,
    andar_id: number,
    marcacoesBloco: string
  ) {
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
  GetPlantasBaixasImagensService,
};
