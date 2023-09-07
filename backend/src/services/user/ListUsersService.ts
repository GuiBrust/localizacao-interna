import prismaClient from "../../prisma";


class ListUsersService {
  async execute() {
    // TODO trazer tdos os usuários
    // apenas id, nome, user, ativo

    const users = await prismaClient.usuario.findMany({
      select: {
        id: true,
        nome: true,
        user: true,
        ativo: true
      }
    });

    return users;
  }
}

export { ListUsersService }