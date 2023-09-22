import { createContext, ReactNode, useState, useEffect } from "react";

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { toast } from 'react-toastify';

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SiginProps) => Promise<void>;
  signOut: () => void;
}

type UserProps = {
  id: string;
  nome: string;
  user: string;
}

type SiginProps = {
  user: string;
  senha: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token')
    Router.push('/')
  } catch {
    toast.error('Erro ao sair da aplicação!')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@nextauth.token': token } = parseCookies();

    if (token) {
      api.get('me').then(response => {
        const { id, nome, user } = response.data;

        setUser({
          id,
          nome,
          user
        })
      })
      .catch(() => {
        // caso ocorra erro, desloga o usuário
        signOut();
      })
    }
  }, [])

  async function signIn({ user, senha }: SiginProps) {
    try {
      const response = await api.post('session', { user, senha });
      const { id, nome, token } = response.data;

      setCookie(undefined, '@nextauth.token',token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/' // all routes possuem acesso ao cookie
      })

      setUser({
        id,
        nome,
        user
      })

      // Passar para as proximas requisições o token
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      toast.success('Login realizado com sucesso!');

      Router.push('/dashboard');

    } catch (error) {
      toast.error('Usuário ou senha inválidos!');
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}