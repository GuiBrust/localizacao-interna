import Head from "next/head";
import Select from "react-select";
import { setupAPIClient } from "../../services/api";

export default function BuscaSala({ plantas_baixas, blocos, tipo, id_tipo }) {
  const salaOptions = plantas_baixas.flatMap((planta_baixa) =>
    planta_baixa.salas.map((sala) => ({
      value: sala.id,
      label: `${planta_baixa.andar.bloco.descricao} - ${sala.descricao}`,
    }))
  );

  const blocoOptions = JSON.parse(blocos.marcacoesBloco).map((bloco) => ({
    value: parseInt(bloco.bloco_id),
    label: bloco.descricao_bloco,
  }));

  const options = [
    {
      label: "Ambientes Externos",
      options: blocoOptions,
    },
    {
      label: "Salas",
      options: salaOptions,
    },
  ];

  const defaultOption =
    options
      .flatMap((group) => group.options)
      .find((option) => option.value == id_tipo) || null;

  return (
    <>
      <Head>
        <title>Busca Sala</title>
      </Head>
      <div>
        <Select
          options={options}
          defaultValue={defaultOption}
          placeholder="Buscar..."
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const salaId = ctx.query.sala_id as string;
  const tipo = ctx.query.tipo as string;

  const apiClient = setupAPIClient(ctx);

  const plantas_baixas = await apiClient
    .get("/plantas_baixas")
    .then((response) => {
      return response.data;
    });

  const blocos = await apiClient
    .get("/plantas_baixas_bloco")
    .then((response) => {
      return response.data;
    });

  return {
    props: {
      plantas_baixas,
      blocos,
      tipo,
      id_tipo: salaId,
    },
  };
};
