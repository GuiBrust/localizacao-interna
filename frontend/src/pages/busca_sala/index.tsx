import Head from "next/head";
import { Box, Button } from "@chakra-ui/react";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import SelectFloatingLabel from "../../components/SelectFloatingLabel";
import BoxImagem from "../../components/BoxImagem";
import BoxDuasImagens from "../../components/BoxDuasImagens";

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
  const [imageUrl, setImageUrl] = useState(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const [imageUrl2, setImageUrl2] = useState(null);
  const [markers2, setMarkers2] = useState<Marker[]>([]);

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

      if (Object.keys(response.data).length === 1) {
        let planta_baixa = response.data["destino"] || response.data["origem"];
        setImageUrl("http://localhost:3333/files/" + planta_baixa.imagem);
        setMarkers(planta_baixa.marcacoes);
        setImageUrl2(null);
        setMarkers2([]);
      } else if (Object.keys(response.data).length === 2) {
        setImageUrl("http://localhost:3333/files/" + response.data["origem"].imagem);
        setMarkers(response.data["origem"].marcacoes);
        setImageUrl2("http://localhost:3333/files/" + response.data["destino"].imagem);
        setMarkers2(response.data["destino"].marcacoes);
      }
    } catch (error) {
      toast.error("Erro ao buscar sala!");
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Busca Sala</title>
      </Head>
      <Box className={styles.containerImagem}>
        {imageUrl2 ? (
          <BoxDuasImagens imageUrl={imageUrl} markers={markers} imageUrl2={imageUrl2} markers2={markers2} />
        ) : (
          <BoxImagem imageUrl={imageUrl} markers={markers} />
        )}
      </Box>

      <Box className={styles.containerFiltros}>
        <SelectFloatingLabel
          instanceId="localizacao-atual"
          options={options}
          defaultValue={currentLocation}
          placeholder="Localização Atual"
          onChange={(option) => {
            setLocalizacaoAtual(option.value);
          }}
        />
        <SelectFloatingLabel
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

  const [plantas_baixas, blocos] = await Promise.all([
    apiClient.get("/plantas_baixas").then((response) => response.data),
    apiClient.get("/plantas_baixas_bloco").then((response) => response.data),
  ]);

  return {
    props: {
      plantas_baixas,
      blocos,
      tipo,
      id_tipo: salaId,
    },
  };
};
