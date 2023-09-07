import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
  async handle(req: Request, res: Response) {
    const usuario_id = Number(req.usuario_id);    

    const DetailUserController = new DetailUserService();

    const user = await DetailUserController.execute(usuario_id);

    return res.json(user);
  }
}

export { DetailUserController }