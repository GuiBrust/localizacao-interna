import prismaClient from "../../prisma";

class CreateBlocoService {
  async execute(descricao: string) {
    const bloco = await prismaClient.bloco.create({
      data: { descricao }
    });

    return bloco;
  }
}

class GetBlocosService {
  async execute() {
    const bloco = await prismaClient.bloco.findMany();

    return bloco;
  }
}

class GetBlocoByIdService {
  async execute(id: number) {
    const bloco = await prismaClient.bloco.findUnique({
      where: { id }
    });

    return bloco;
  }
}

class UpdateBlocoService {
  async execute(id: number, descricao: string) {
    const bloco = await prismaClient.bloco.update({
      where: { id },
      data: { descricao }
    });

    return bloco;
  }
}

class DeleteBlocoService {
  async execute(id: number) {
    const bloco = await prismaClient.bloco.delete({
      where: { id }
    });

    return bloco;
  }
}

export {
  CreateBlocoService,
  GetBlocosService,
  GetBlocoByIdService,
  UpdateBlocoService,
  DeleteBlocoService
}