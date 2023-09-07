import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  nome: string;
  user: string;
  senha: string;
}

class CreateUserService {
  async execute({ nome, user, senha }: UserRequest) {
    const userAlreadyExists = await prismaClient.usuario.findFirst({
      where: {
        user: user,
      },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const passwordHash = await hash(senha, 8);

    const userCreated = await prismaClient.usuario.create({
      data: {
        nome,
        user,
        senha: passwordHash,
      },
      select: { id: true, nome: true, user: true, ativo: true }
    });

    return userCreated;
  }

}

export { CreateUserService }