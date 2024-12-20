import { Request, Response } from "express";
import { CreateSalaService, GetSalasPorPlantaBaixaService, GetSalasService, UpdateSalaService, DeleteSalaService, DeleteSalasPorPlantaBaixaService } from "../../services/sala/SalaService";

class CreateSalaController {
  async handle(req: Request, res: Response) {
    const { descricao, planta_baixa_id, coordenada_x, coordenada_y, numero } = req.body;

    const createSalaService = new CreateSalaService();

    const sala = await createSalaService.execute({ descricao, planta_baixa_id, coordenada_x, coordenada_y, numero });

    return res.json(sala);
  }
}

class GetSalasPorPlantaBaixaController {
  async handle(req: Request, res: Response) {
    const { planta_baixa_id } = req.query;

    const getSalasPorPlantaBaixaService = new GetSalasPorPlantaBaixaService();

    const sala = await getSalasPorPlantaBaixaService.execute(Number(planta_baixa_id));

    return res.json(sala);
  }
}

class GetSalasController {
  async handle(req: Request, res: Response) {
    const getSalasService = new GetSalasService();

    const sala = await getSalasService.execute();

    return res.json(sala);
  }
}

class UpdateSalaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { descricao, coordenada_x, coordenada_y } = req.body;

    const updateSalaService = new UpdateSalaService();

    const sala = await updateSalaService.execute(Number(id), descricao, coordenada_x, coordenada_y);

    return res.json(sala);
  }
}

class DeleteSalasPorPlantaBaixaController {
  async handle(req: Request, res: Response) {
    const { planta_baixa_id } = req.params;

    const deleteSalasPorPlantaBaixaService = new DeleteSalasPorPlantaBaixaService();

    const sala = await deleteSalasPorPlantaBaixaService.execute(Number(planta_baixa_id));

    return res.json(sala);
  }
}

class DeleteSalaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteSalaService = new DeleteSalaService();

    const sala = await deleteSalaService.execute(Number(id));

    return res.json(sala);
  }
}

export {
  CreateSalaController,
  GetSalasPorPlantaBaixaController,
  GetSalasController,
  UpdateSalaController,
  DeleteSalaController,
  DeleteSalasPorPlantaBaixaController
}