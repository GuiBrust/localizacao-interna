import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import styles from "../../styles/home.module.scss";
import Image from "next/image";

import logoImg from "../../public/header.png";

import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

import { canSSRGuest } from "../utils/canSSRGuest";

import { Input, FormControl, FormLabel, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (user === "" || senha === "") {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    let data = {
      user,
      senha,
    };

    await signIn(data);

    setLoading(false);
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
            <FormControl variant="floating">
              <Input placeholder=" " type="text" value={user} onChange={(event) => setUser(event.target.value)} />
              <FormLabel>Usuário</FormLabel>
            </FormControl>

            <FormControl variant="floating">
              <InputGroup>
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder=" "
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <FormLabel>Senha</FormLabel>
                <InputRightElement width="4.5rem">
                  <Button size="sm" onClick={handleClick} variant="ghost" _hover={{ bg: "transparent" }}>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button isLoading={loading} loadingText="Entrando..." type="submit" colorScheme="blue">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
