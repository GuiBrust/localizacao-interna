import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  id: number;
  nome?: string;
  user?: string;
  senha?: string;
  ativo?: boolean;
}

class UpdateUserService {
  async execute({ id, ...updatedFields }: UserRequest) {
    updatedFields.senha = await hash(updatedFields.senha, 8);

    const userUpdated = await prismaClient.usuario.update({
      where: {
        id: id,
      },
      data: updatedFields, // { nome: nome, user: user, senha: senha, ativo: ativo }
      select: {
        id: true,
        nome: true,
        user: true,
        ativo: true,
      },
    });

    return userUpdated;
  }
}

export { UpdateUserService };
