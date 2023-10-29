import prismaClient from "../../prisma";

interface AndarRequest {
  descricao: string;
  bloco_id: number;
}

class CreateAndarService {
  async execute({ descricao, bloco_id }: AndarRequest) {
    const andar = await prismaClient.andar.create({
      data: { descricao, bloco_id }
    });

    return andar;
  }
}

class GetAndaresService {
  async execute() {
    const andar = await prismaClient.andar.findMany({
      include: { bloco: true },
      orderBy: { id: 'desc' }
    });

    return andar;
  }
}

class GetAndarToBlocoService {
  async execute(bloco_id: number) {
    const andar = await prismaClient.andar.findMany({
      where: { bloco_id: bloco_id },
      orderBy: { id: 'asc' }
    });

    return andar;
  }
}

class UpdateAndarService {
  async execute(id: number, descricao: string, bloco_id: number) {
    const andar = await prismaClient.andar.update({
      where: { id },
      data: { descricao, bloco_id }
    });

    return andar;
  }
}

class DeleteAndarService {
  async execute(id: number) {
    const andar = await prismaClient.andar.delete({
      where: { id }
    });

    return andar;
  }
}

export {
  CreateAndarService,
  GetAndaresService,
  GetAndarToBlocoService,
  UpdateAndarService,
  DeleteAndarService
};