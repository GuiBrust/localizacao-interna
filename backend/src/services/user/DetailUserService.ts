import prismaClient from "../../prisma";

class DetailUserService {
  async execute(user_id: number) {  
    const user = await prismaClient.usuario.findFirst({
      where: { id: user_id },
      select: { id: true, nome: true, user: true }
    });

    return user;
  }
}

export { DetailUserService }