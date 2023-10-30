import { Request, Response } from "express";
import {
  CreatePlantaBaixaService,
  GetPlantasBaixasService,
  GetPlantaBaixaByIdService,
  UpdatePlantaBaixaService,
  DeletePlantaBaixaService
} from "../../services/planta_baixa/PlantaBaixaService";

class CreatePlantaBaixaController {
  async handle(req: Request, res: Response) {
    const { descricao, andar_id } = req.body;

    const createPlantaBaixaService = new CreatePlantaBaixaService();
    const andar = Number(andar_id);

    if (!req.file) {
      return res.status(400).json({ message: 'Imagem não encontrada' });
    } else {
      const planta_baixa = await createPlantaBaixaService.execute({
        descricao,
        imagem: req.file.filename,
        andar_id: andar
      });

      return res.json(planta_baixa);
    }
  }
}

class GetPlantasBaixasController {
  async handle(req: Request, res: Response) {
    const getPlantasBaixasService = new GetPlantasBaixasService();

    const plantas_baixas = await getPlantasBaixasService.execute();

    return res.json(plantas_baixas);
  }
}

class GetPlantaBaixaByIdController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getPlantaBaixaByIdService = new GetPlantaBaixaByIdService();

    const planta_baixa = await getPlantaBaixaByIdService.execute(Number(id));

    return res.json(planta_baixa);
  }
}

class UpdatePlantaBaixaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { descricao, andar_id } = req.body;

    const updatePlantaBaixaService = new UpdatePlantaBaixaService();

    try {
      let planta_baixa;

      if (req.file) {
        planta_baixa = await updatePlantaBaixaService.executeWithImage(
          Number(id),
          descricao,
          req.file.filename,
          Number(andar_id)
        );
      } else {
        planta_baixa = await updatePlantaBaixaService.executeWithoutImage(
          Number(id),
          descricao,
          Number(andar_id)
        );
      }

      return res.json(planta_baixa);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar a planta baixa' });
    }
  }
}

class DeletePlantaBaixaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deletePlantaBaixaService = new DeletePlantaBaixaService();

    const planta_baixa = await deletePlantaBaixaService.execute(Number(id));

    return res.json(planta_baixa);
  }
}

export {
  CreatePlantaBaixaController,
  GetPlantasBaixasController,
  GetPlantaBaixaByIdController,
  UpdatePlantaBaixaController,
  DeletePlantaBaixaController
}