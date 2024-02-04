import Head from "next/head";
import Select from "react-select";
import { Box, Button } from "@chakra-ui/react";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

export default function BuscaSala({ plantas_baixas, blocos, tipo, id_tipo }) {
  let salaOptions = plantas_baixas.flatMap((planta_baixa) =>
    planta_baixa.salas.map((sala) => ({
      value: `${sala.id}_salas`,
      label: `${planta_baixa.andar.bloco.descricao} - ${sala.descricao}`,
    }))
  );

  salaOptions = salaOptions.sort((a, b) => a.label.localeCompare(b.label));

  let blocoOptions = JSON.parse(blocos.marcacoesBloco).map((bloco) => ({
    value: `${bloco.bloco_id}_bloco`,
    label: bloco.descricao_bloco,
  }));

  blocoOptions = blocoOptions.sort((a, b) => a.label.localeCompare(b.label));

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

  const currentLocation = options.flatMap((group) => group.options).find((option) => option.value == `${id_tipo}_${tipo}`) || null;

  const [localizacaoAtual, setLocalizacaoAtual] = useState(currentLocation?.value || null);
  const [destinoDesejado, setDestinoDesejado] = useState(null);

  const handleSubmit = async () => {
    if (!localizacaoAtual || !destinoDesejado) {
      toast.error("Selecione a localização atual e o destino desejado!");
      return;
    }

    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.get("/plantas_baixas_busca_imagens", {
        params: {
          localizacaoAtual,
          destinoDesejado,
        },
      });

      // deverá ser utilizado para verificar o tamanho do retorno
      // Object.keys(response.data).length
      console.log(response.data);
    } catch (error) {
      toast.error("Erro ao buscar sala!");
    }
  };

  return (
    <>
      <Head>
        <title>Busca Sala</title>
      </Head>
      <Box className={styles.containerImagem}>{/* O conteúdo existente vem aqui dentro do Box */}</Box>

      <Box className={styles.containerFiltros}>
        <Select
          instanceId="localizacao-atual"
          options={options}
          defaultValue={currentLocation}
          placeholder="Localização Atual"
          onChange={(option) => {
            setLocalizacaoAtual(option.value);
          }}
        />
        <Select
          instanceId="destino-desejado"
          options={options}
          placeholder="Destino Desejado"
          onChange={(option) => {
            setDestinoDesejado(option.value);
          }}
        />
        <Button type="submit" colorScheme="green" onClick={handleSubmit}>
          Buscar
        </Button>
      </Box>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const salaId = (ctx.query.sala_id as string) || null;
  const tipo = (ctx.query.tipo as string) || null;

  const apiClient = setupAPIClient(ctx);

  const plantas_baixas = await apiClient.get("/plantas_baixas").then((response) => {
    return response.data;
  });

  const blocos = await apiClient.get("/plantas_baixas_bloco").then((response) => {
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
