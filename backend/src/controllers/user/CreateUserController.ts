import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";


class CreateUserController {
  async handle(request: Request, response: Response) {
    const { nome, user, senha } = request.body;

    const createUserService = new CreateUserService();
    const usuario = await createUserService.execute({ nome, user, senha });

    return response.json(usuario);
  }
}

export { CreateUserController };