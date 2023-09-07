import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
  async handle(request: Request, response: Response) {
    const { id, nome, user, senha, ativo } = request.body;

    const updateUserService = new UpdateUserService();
    const usuario = await updateUserService.execute({ id, nome, user, senha, ativo });

    return response.json(usuario);
  }
}

export { UpdateUserController };
