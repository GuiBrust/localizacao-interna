import prismaClient from "../../prisma";

interface UserRequest {
  id: number;
}

class DeleteUserService {
  async execute({ id }: UserRequest) {

    const userDeleted = await prismaClient.usuario.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        nome: true,
        user: true,
      },
    });

    return userDeleted;
  }
}

export { DeleteUserService };
