import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/DeleteUserService";


class DeleteUserController {
  async handle(request: Request, response: Response) {
    const id = Number(request.body.id);

    const deleteUserService = new DeleteUserService();

    const usuario = await deleteUserService.execute({ id });

    return response.json(usuario);
  }
}

export { DeleteUserController };