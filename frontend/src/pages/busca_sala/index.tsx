import Head from "next/head";

import { Header } from "../../components/Header";

export default function BuscaSala() {
  return (
    <>
      <Head>
        <title>Busca Sala</title>
      </Head>
      <div>
        <Header />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const salaId = ctx.query.sala_id as string;
  const tipo = ctx.query.tipo as string;

  console.log("salaId:", salaId);
  console.log("tipo:", tipo);

  return {
    props: {},
  };
};
