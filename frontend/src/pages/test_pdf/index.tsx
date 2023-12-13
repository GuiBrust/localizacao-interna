import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";

import { Header } from "../../components/Header";
import geraPDF from "../../components/MyDocument";
import { Button, ButtonGroup } from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div>
        <Header />
        {/* TODO criar botão imprimir */}
        <Button
          onClick={(e) => geraPDF({ nome: "Sala 28", linkQrCode: "teste.com" })}
          colorScheme="red"
        >
          Imprimir
        </Button>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
