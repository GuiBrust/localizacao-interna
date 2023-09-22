import { useContext } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { FiLogOut } from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext';

export function Header() {

  const { signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a href="/dashboard" >
          <Image src="/header.png" alt="Dashboard" width={230} height={50} />
        </a>

        <nav className={styles.menuNav}>
          <Link href="/usuario" passHref>
            <a>Usuários</a>
          </Link>

          <Link href="/bloco" passHref>
            <a>Blocos</a>
          </Link>

          <Link href="/bloco" passHref>
            <a>Andar</a>
          </Link>

          <Link href="/bloco" passHref>
            <a>Planta Baixa</a>
          </Link>

          <button onClick={signOut}>
            <FiLogOut color='#000' size={20} />
          </button>
        </nav>
      </div>
    </header>
  )
}