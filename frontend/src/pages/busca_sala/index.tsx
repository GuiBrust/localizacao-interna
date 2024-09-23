import Head from "next/head";
import { Box, Button } from "@chakra-ui/react";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import SelectFloatingLabel from "../../components/SelectFloatingLabel";
import BoxImagem from "../../components/BoxImagem";
import BoxDuasImagens from "../../components/BoxDuasImagens";
import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";

export default function BuscaSala({ plantas_baixas, blocos, tipo, id_tipo }) {
  let salaOptions = plantas_baixas.flatMap((planta_baixa) =>
    planta_baixa.salas.map((sala) => ({
      value: `${sala.id}_salas`,
      label: `${planta_baixa.andar.bloco.descricao} - ${sala.descricao}`,
      type: "Salas",
    }))
  );

  salaOptions = salaOptions.sort((a, b) => a.label.localeCompare(b.label));

  let blocoOptions = [];
  if (blocos?.marcacoesBloco) {
    blocoOptions = JSON.parse(blocos.marcacoesBloco).map((bloco) => ({
      value: `${bloco.bloco_id}_bloco`,
      label: bloco.descricao_bloco,
      type: "Ambientes Externos",
    }));
  }

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

  const currentLocation =
    options
      .flatMap((group) => group.options)
      .find((option) => option.value === `${id_tipo}_${tipo}`) || null;

  const [localizacaoAtual, setLocalizacaoAtual] = useState(currentLocation || null);
  const [destinoDesejado, setDestinoDesejado] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [markers, setMarkers] = useState([]);

  const [imageUrl2, setImageUrl2] = useState(null);
  const [markers2, setMarkers2] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOptionsForLocalizacaoAtual = () => options;

  const getOptionsForDestinoDesejado = () => {
    if (localizacaoAtual && localizacaoAtual.type) {
      return options.map((group) => ({
        ...group,
        options: group.options.map((option) => ({
          ...option,
          isDisabled: option.type !== localizacaoAtual.type,
        })),
      }));
    }
    return options;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!localizacaoAtual || !destinoDesejado) {
      toast.error("Selecione a localização atual e o destino desejado!");
      setLoading(false);
      return;
    }

    const apiClient = setupAPIClient();
    const endereco = process.env.NEXT_PUBLIC_API_URL + "files/";

    try {
      const response = await apiClient.get("/plantas_baixas_busca_imagens", {
        params: {
          localizacaoAtual: localizacaoAtual.value,
          destinoDesejado: destinoDesejado.value,
        },
      });

      if (Object.keys(response.data).length === 1) {
        let planta_baixa = response.data["destino"] || response.data["origem"];
        setImageUrl(endereco + planta_baixa.imagem);
        setMarkers(planta_baixa.marcacoes);
        setImageUrl2(null);
        setMarkers2([]);
      } else if (Object.keys(response.data).length === 2) {
        setImageUrl(endereco + response.data["origem"].imagem);
        setMarkers(response.data["origem"].marcacoes);
        setImageUrl2(endereco + response.data["destino"].imagem);
        setMarkers2(response.data["destino"].marcacoes);
      }
    } catch (error) {
      toast.error("Erro ao buscar sala!");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Busca Sala</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Box className={styles.containerImagem}>
        {imageUrl2 ? (
          <BoxDuasImagens
            imageUrl={imageUrl}
            markers={markers}
            imageUrl2={imageUrl2}
            markers2={markers2}
          />
        ) : (
          <BoxImagem imageUrl={imageUrl} markers={markers} />
        )}
      </Box>

      <Box className={styles.containerFiltros}>
        <SelectFloatingLabel
          instanceId="localizacao-atual"
          options={getOptionsForLocalizacaoAtual()}
          value={localizacaoAtual}
          placeholder={
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaMapPin style={{ color: "blue", marginRight: "5px" }} />
              <span>Localização Atual</span>
            </div>
          }
          onChange={(option) => {
            setLocalizacaoAtual(option);
            setDestinoDesejado(null);
          }}
        />
        <SelectFloatingLabel
          instanceId="destino-desejado"
          options={getOptionsForDestinoDesejado()}
          value={destinoDesejado}
          placeholder={
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaMapMarkerAlt style={{ color: "red", marginRight: "5px" }} />
              <span>Destino Desejado</span>
            </div>
          }
          onChange={(option) => {
            setDestinoDesejado(option);
          }}
        />
        <Button
          type="submit"
          colorScheme="green"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Buscando..."
        >
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
