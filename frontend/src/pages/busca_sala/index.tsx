import Head from "next/head";
import Select from "react-select";

export default function BuscaSala() {
  // Opções fictícias para o Select
  const options = [
    {
      label: "Salas",
      options: [
        { value: "1", label: "Sala 101" },
        { value: "2", label: "Sala 102" },
      ],
    },
    {
      label: "Externos",
      options: [
        { value: "1", label: "Bloco B" },
        { value: "2", label: "Bloco S" },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Busca Sala</title>
      </Head>
      <div>
        <Select options={options} placeholder="Buscar..." />
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const salaId = ctx.query.sala_id as string;
  const tipo = ctx.query.tipo as string;

  console.log("salaId:", salaId);
  console.log("tipo:", tipo);

  return {
    props: {},
  };
};
