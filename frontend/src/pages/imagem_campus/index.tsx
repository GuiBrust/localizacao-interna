import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import {
  Box,
  Button,
  Flex,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { FcAddImage } from "react-icons/fc";
import ImageMarker, { Marker } from "react-image-marker";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import React, { ChangeEvent } from 'react';
import styles from "./styles.module.scss";

type BlocoProps = {
  id: number;
  descricao: string;
};

type PlantaBaixaProps = {
  id: number;
  descricao: string;
  marcacoesBloco: string;
  imagem?: string;
};

interface DashboardProps {
  planta_baixa: PlantaBaixaProps;
  blocos: BlocoProps[];
}

interface CustomMarker extends Marker {
  bloco_id?: string;
  descricao_bloco?: string;
  id?: any
}

async function handlePutPlantaBaixa(id: string, file: File, markers: Marker[]) {
  try {
    const apiClient = setupAPIClient();
    const formData = new FormData();

    formData.append("marcacoesBloco", JSON.stringify(markers));
    formData.append("file", file);
    formData.append("descricao", "Imagem ");

    await apiClient.put("/plantas_baixas/" + id, formData);

    toast.success("Imagem Campus cadastrada com sucesso!");
  } catch {
    toast.error("Erro ao atualizar Planta Baixa!");
    return;
  }
}

async function validaFormulario(
  file: File,
  markers: CustomMarker[],
  isUpdate: boolean
) {
  let valido = true;

  if (!isUpdate && !file) {
    toast.error("Selecione uma imagem!", {
      position: "bottom-center",
      autoClose: false,
    });
    valido = false;
  }

  if (markers.length === 0) {
    return valido;
  }

  const blocosEncontrados = {};
  const duplicados = [];

  markers.forEach((marker) => {
    const blocoId = marker.bloco_id;

    if (!blocoId) {
      toast.error("Marcação " + marker.id + " não possui bloco selecionado!", {
        position: "bottom-center",
        autoClose: false,
      });
      valido = false;
    }

    if (blocosEncontrados[blocoId]) {
      duplicados.push(marker.id);
    } else {
      blocosEncontrados[blocoId] = true;
    }
  });

  if (duplicados.length > 0) {
    const mensagem =
      "Bloco " +
      duplicados.join(", ") +
      " informado para as seguintes marcações: " +
      duplicados.join(", ");
    toast.error(mensagem, {
      position: "bottom-center",
      autoClose: false,
    });
    valido = false;
  }

  return valido;
}

export default function Dashboard({ planta_baixa, blocos }: DashboardProps) {
  const link_imagem =
    planta_baixa && planta_baixa.imagem
      ? "http://localhost:3333/files/" + planta_baixa.imagem
      : "";
  const [imageUrl, setImageUrl] = useState(link_imagem);
  const [imageProd, setImage] = useState(null);
  const [opcoes_blocos, setOpcoesBlocos] = useState([]);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [planta_baixa_id, setPlantaBaixaId] = useState(
    planta_baixa?.id ?? null
  );

  useEffect(() => {
    async function fetchBlocos() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/blocos");
        setOpcoesBlocos(response.data);
      } catch {
        toast.error("Erro ao buscar opções de Blocos!");
      }
    }

    fetchBlocos();
    if (planta_baixa?.marcacoesBloco) {
      setMarkers(JSON.parse(planta_baixa.marcacoesBloco));
    }
  }, [planta_baixa]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      toast.error("Formato de imagem inválido!");
    }
  }

  async function handlePostPlantaBaixa(file: File, markers: Marker[]) {
    let response;
    try {
      const apiClient = setupAPIClient();
      const formData = new FormData();

      formData.append("marcacoesBloco", JSON.stringify(markers));
      formData.append("file", file);
      formData.append("descricao", "Imagem Campus");

      response = await apiClient.post("/plantas_baixas", formData);
      const plantaBaixa = response.data;
      setPlantaBaixaId(plantaBaixa.id);

      toast.success("Imagem Campus cadastrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar Planta Baixa!");
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Campus</title>
      </Head>
      <div>
        <Header />
        <Stack direction={{ base: "column", md: "row", lg: "row" }} spacing={4}>
          <Box className={styles.imageContainer} flex={2} m={2} mt={0} p="5">
            <label className={styles.labelImage}>
              <span
                onClick={() => document.getElementById("fileInput").click()}
              >
                <FcAddImage size={30} />
              </span>
              {imageUrl && (
                <ImageMarker
                  src={imageUrl}
                  markers={markers}
                  onAddMarker={(marker: Marker) => {
                    setMarkers([...markers, marker]);
                  }}
                />
              )}
            </label>
            <input
              className={styles.inputImage}
              type="file"
              accept="image/png, image/jpeg"
              id="fileInput"
              onChange={handleFile}
            />
          </Box>
          <Box className={styles.tableContainer} flex={1} m={2} p="5">
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Nº</Th>
                    <Th>Bloco</Th>
                    <Th p={0}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {markers.map((marker, index) => (
                    <Tr key={index} _hover={{ bg: "gray.100" }}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Select
                          placeholder="Selecione um Bloco"
                          value={marker.bloco_id}
                          onChange={(e) => {
                            const updatedMarkers = [...markers];
                            const selectedIndex = e.target.selectedIndex;
                            const selectElement = e.target as HTMLSelectElement;
                            const selectedOption = selectElement.options[selectedIndex] as HTMLOptionElement;
                          
                            updatedMarkers[index].bloco_id = e.target.value;
                            updatedMarkers[index].descricao_bloco = selectedOption.text;
                          
                            setMarkers(updatedMarkers);
                          }}
                        >
                          {opcoes_blocos.map((bloco) => (
                            <option key={bloco.id} value={bloco.id}>
                              {bloco.descricao}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td p={0}>
                        <DeleteIcon
                          color="red.500"
                          fontSize={20}
                          cursor="pointer "
                          onClick={() => {
                            setMarkers(
                              markers.filter((_, indice) => indice !== index)
                            );
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
        <Flex>
          <Box ml="4">
            <Button
              colorScheme="blue"
              m={3}
              onClick={async () => {
                const isValid = await validaFormulario(
                  imageProd,
                  markers,
                  !!planta_baixa_id
                );

                if (!isValid) {
                  return;
                }

                if (planta_baixa_id) {
                  await handlePutPlantaBaixa(planta_baixa_id.toString(), imageProd, markers);
                } else {
                  await handlePostPlantaBaixa(imageProd, markers);
                }
              }}
            >
              Salvar
            </Button>
          </Box>
        </Flex>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const [planta_baixa, blocos] = await Promise.all([
    apiClient.get("/plantas_baixas_bloco").then((response) => response.data),
    apiClient.get("/blocos").then((response) => response.data),
  ]);

  return {
    props: {
      planta_baixa,
      blocos,
    },
  };
});
