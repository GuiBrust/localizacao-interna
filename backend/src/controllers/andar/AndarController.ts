import { Request, Response } from "express";
import {
  CreateAndarService,
  GetAndaresService,
  GetAndarToBlocoService,
  UpdateAndarService,
  DeleteAndarService
} from "../../services/andar/AndarService";

class CreateAndarController {
  async handle(req: Request, res: Response) {
    const { descricao, bloco_id } = req.body;

    const createAndarService = new CreateAndarService();

    const andar = await createAndarService.execute({ descricao, bloco_id });

    return res.json(andar);
  }
}

class GetAndaresController {
  async handle(req: Request, res: Response) {
    const getAndaresService = new GetAndaresService();

    const andares = await getAndaresService.execute();

    return res.json(andares);
  }
}

class GetAndarToBlocoController {
  async handle(req: Request, res: Response) {
    const { bloco_id } = req.params;

    const getAndarToBlocoService = new GetAndarToBlocoService();

    const andares = await getAndarToBlocoService.execute(Number(bloco_id));

    return res.json(andares);
  }
}

class UpdateAndarController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { descricao, bloco_id } = req.body;

    const updateAndarService = new UpdateAndarService();

    const andar = await updateAndarService.execute(Number(id), descricao, bloco_id);

    return res.json(andar);
  }
}

class DeleteAndarController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteAndarService = new DeleteAndarService();

    const andar = await deleteAndarService.execute(Number(id));

    return res.json(andar);
  }
}

export {
  CreateAndarController,
  GetAndaresController,
  GetAndarToBlocoController,
  UpdateAndarController,
  DeleteAndarController
};