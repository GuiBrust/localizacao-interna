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

class GetAndarByIdService {
  // TODO busca o bloco pelo id
  async execute(id: number) {
    const andar = await prismaClient.andar.findUnique({
      where: { id },
      include: { bloco: true }
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
  GetAndarByIdService,
  UpdateAndarService,
  DeleteAndarService
};