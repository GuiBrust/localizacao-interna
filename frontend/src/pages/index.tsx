import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head'
import styles from '../../styles/home.module.scss'
import Image from 'next/image'

import logoImg from '../../public/header.png'

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import { AuthContext } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

import { canSSRGuest } from '../utils/canSSRGuest'

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [user, setUser] = useState('')
  const [senha, setSenha] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (user === '' || senha === '') {
      toast.warning('Preencha todos os campos!');
      return;
    }

    setLoading(true)

    let data = {
      user,
      senha
    }

    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="CampusFind" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder='Usuário'
              type='text'
              value={user}
              onChange={event => setUser(event.target.value)}
            />

            <Input
              placeholder='Senha'
              type='password'
              value={senha}
              onChange={event => setSenha(event.target.value)}
            />

            <Button
              type='submit'
              Loading={loading}
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})
