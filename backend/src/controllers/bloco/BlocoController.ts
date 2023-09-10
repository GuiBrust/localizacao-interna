import { Request, Response } from "express";
import {
  CreateBlocoService,
  GetBlocosService,
  GetBlocoByIdService,
  UpdateBlocoService,
  DeleteBlocoService
} from "../../services/bloco/BlocoService";

class CreateBlocoController {
  async handle(req: Request, res: Response) {
    const { descricao } = req.body;

    const createBlocoService = new CreateBlocoService();

    const bloco = await createBlocoService.execute(descricao);

    return res.json(bloco);
  }
}

class GetBlocosController {
  async handle(req: Request, res: Response) {
    const getBlocosService = new GetBlocosService();

    const blocos = await getBlocosService.execute();

    return res.json(blocos);
  }
}

class GetBlocoByIdController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getBlocoByIdService = new GetBlocoByIdService();

    const bloco = await getBlocoByIdService.execute(Number(id));

    return res.json(bloco);
  }
}

class UpdateBlocoController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { descricao } = req.body;

    const updateBlocoService = new UpdateBlocoService();

    const bloco = await updateBlocoService.execute(Number(id), descricao);

    return res.json(bloco);
  }
}

class DeleteBlocoController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteBlocoService = new DeleteBlocoService();

    const bloco = await deleteBlocoService.execute(Number(id));

    return res.json(bloco);
  }
}

export {
  CreateBlocoController,
  GetBlocosController,
  GetBlocoByIdController,
  UpdateBlocoController,
  DeleteBlocoController
}