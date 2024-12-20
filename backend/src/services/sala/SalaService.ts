import e from "express";
import prismaClient from "../../prisma";

interface SalaRequest {
  descricao: string;
  planta_baixa_id: number;
  coordenada_x: string;
  coordenada_y: string;
  numero: number;
}

class CreateSalaService {
  async execute({ descricao, planta_baixa_id, coordenada_x, coordenada_y, numero }: SalaRequest) {
    const sala = await prismaClient.sala.create({
      data: { descricao, planta_baixa_id, coordenada_x, coordenada_y, numero }
    });

    return sala;
  }
}

class GetSalasPorPlantaBaixaService {
  async execute(planta_baixa_id: number) {
    const sala = await prismaClient.sala.findMany({
      where: { planta_baixa_id },
      orderBy: { numero: 'asc' }
    });

    return sala;
  }
}

class GetSalasService {
  async execute() {
    const sala = await prismaClient.sala.findMany({
      include: { planta_baixa: { include: { andar: { include: { bloco: true } } } } },      
      orderBy: { id: 'desc' }
    });

    return sala;
  }
}

class UpdateSalaService{
  async execute(id: number, descricao: string, coordenada_x: string, coordenada_y: string) {
    const sala = await prismaClient.sala.update({
      where: { id },
      data: { descricao, coordenada_x, coordenada_y }
    });

    return sala;
  }
}

class DeleteSalasPorPlantaBaixaService{
  async execute(planta_baixa_id: number) {
    const sala = await prismaClient.sala.deleteMany({
      where: { planta_baixa_id }
    });

    return sala;
  }
}

class DeleteSalaService{
  async execute(id: number) {
    const sala = await prismaClient.sala.delete({
      where: { id }
    });

    return sala;
  }
}

export {
  CreateSalaService,
  GetSalasPorPlantaBaixaService,
  GetSalasService,
  UpdateSalaService,
  DeleteSalaService,
  DeleteSalasPorPlantaBaixaService
}