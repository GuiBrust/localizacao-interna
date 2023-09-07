import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  user: string;
  senha: string;
}

class AuthUserService {
  async execute({ user, senha }: AuthRequest) {
    const usuario = await prismaClient.usuario.findFirst({ where: { user } });

    if (!usuario) {
      throw new Error("Usuário/Senha incorretos");
    }

    const passwordMatch = await compare(senha, usuario.senha)

    if (!passwordMatch) {
      throw new Error("Usuário/Senha incorretos");
    }

    const token = sign({ 
      nome: usuario.nome, 
      user: usuario.user 
    }, process.env.JWT_SECRET, {
      subject: String(usuario.id),
      expiresIn: "30d"
    })

    return {
      id: usuario.id,
      nome: usuario.nome,
      user: usuario.user,
      token: token
    }
  }
}

export { AuthUserService };