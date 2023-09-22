import Head from 'next/head'
import { Header } from '../../components/Header'
import styles from './styles.module.scss'

export default function Usuario() {
  return (
    <>
      <Head>
        <title>Usuário</title>
      </Head>
      <Header />
      <h1>Usuário</h1>
    </>
  )
}