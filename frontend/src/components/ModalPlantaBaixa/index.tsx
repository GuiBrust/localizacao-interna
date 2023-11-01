/* eslint-disable @next/next/no-img-element */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Box,
  Select,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import styles from "./styles.module.scss";
import { FcAddImage } from "react-icons/fc";
import Image from "next/image";
import ImageMarker, { Marker } from "react-image-marker";

async function cadastraSalas(id_planta_baixa: number, markers: Marker[]) {
  const apiClient = setupAPIClient();

  try {
    await apiClient.delete(`/salas/planta_baixa/${id_planta_baixa}`);

    await Promise.all(
      markers.map(async (marker, indice) => {
        await apiClient.post("/salas", {
          descricao: "Sala x",
          planta_baixa_id: id_planta_baixa,
          coordenada_x: String(marker.left),
          coordenada_y: String(marker.top),
          numero: indice + 1,
        });
      })
    );

    toast.success("Salas cadastradas com sucesso!");
  } catch (error) {
    toast.error("Erro ao cadastrar salas!");
  }
}

export default function ModalPlantaBaixa({
  isOpen,
  onClose,
  dataEdit,
  setData,
}) {
  const [descricao, setDescricao] = useState(dataEdit.descricao || "");
  const [bloco_id, setBloco_id] = useState(dataEdit.andar?.bloco_id || "");
  const [andar_id, setAndar_id] = useState(dataEdit.andar?.id || "");
  const [opcoes_blocos, setOpcoesBlocos] = useState([]);
  const [opcoes_andares, setOpcoesAndares] = useState([]);

  const link_imagem = dataEdit.imagem
    ? "http://localhost:3333/files/" + dataEdit.imagem
    : "";
  const [imageUrl, setImageUrl] = useState(link_imagem);
  const [imageProd, setImage] = useState(null);

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

    async function fetchAndares() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/andares/" + bloco_id);
        setOpcoesAndares(response.data);
      } catch {
        toast.error("Erro ao buscar opções de Andares!");
      }
    }

    async function fetchSalas() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get(
          `/salas?planta_baixa_id=${dataEdit.id}`
        );

        setMarkers(
          response.data.map((sala) => ({
            top: parseFloat(sala.coordenada_y),
            left: parseFloat(sala.coordenada_x),
          }))
        );
      } catch {
        toast.error("Erro ao buscar Salas!");
      }
    }

    if (isOpen) {
      fetchBlocos();
      fetchAndares();
      if (dataEdit.id) {
        fetchSalas();
      }
    }
  }, [bloco_id, isOpen, dataEdit.id]);

  async function handlePostPlantaBaixa(
    descricao: string,
    andar_id: number,
    file: File,
    markers: Marker[]
  ) {
    let response;
    try {
      const apiClient = setupAPIClient();
      const formData = new FormData();

      formData.append("descricao", descricao);
      formData.append("andar_id", String(andar_id));
      formData.append("file", file);

      await apiClient.post("/plantas_baixas", formData);
      toast.success("Planta baixa cadastrada com sucesso!");

      response = await apiClient.get("/plantas_baixas");
      setData(response.data);
    } catch (error) {
      toast.error("Erro ao cadastrar planta baixa!");
      onClose();
      return;
    }

    if (markers.length > 0) {
      cadastraSalas(response.data.id, markers);
    }

    onClose();
  }

  async function handlePutPlantaBaixa(
    id: string,
    descricao: string,
    andar_id: number,
    file: File,
    markers: Marker[]
  ) {
    try {
      const apiClient = setupAPIClient();
      const formData = new FormData();

      formData.append("descricao", descricao);
      formData.append("andar_id", String(andar_id));
      formData.append("file", file);

      await apiClient.put("/plantas_baixas/" + id, formData);

      const response = await apiClient.get("/plantas_baixas");
      setData(response.data);
      toast.success("Planta baixa atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar planta baixa!");
      onClose();
      return;
    }

    if (markers.length > 0) {
      cadastraSalas(id, markers);
    }
  }

  const [markers, setMarkers] = useState<Marker[]>([]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {dataEdit.id ? "Editar " : "Cadastrar "}
          Planta Baixa
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex direction={{ base: "column", md: "row" }}>
            <Box flex={1} m={2}>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Input
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormControl>
            </Box>
            <Box flex={1} m={2}>
              <FormControl>
                <FormLabel>Bloco</FormLabel>
                <Select
                  placeholder="Selecione um bloco"
                  value={bloco_id}
                  onChange={(e) => setBloco_id(e.target.value)}
                >
                  {opcoes_blocos.map((bloco) => (
                    <option key={bloco.id} value={bloco.id}>
                      {bloco.descricao}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box flex={1} m={2}>
              <FormControl>
                <FormLabel>Andar</FormLabel>
                <Select
                  placeholder="Selecione um andar"
                  value={andar_id}
                  onChange={(e) => setAndar_id(e.target.value)}
                >
                  {opcoes_andares.map((andar) => (
                    <option key={andar.id} value={andar.id}>
                      {andar.descricao}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Flex>
          <Flex>
            <Box flex={2} m={2}>
              <label className={styles.labelImage}>
                <span
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FcAddImage size={30} />
                </span>
                {imageUrl && (
                  <ImageMarker
                    className={styles.previewImage}
                    src={imageUrl}
                    markers={markers}
                    onAddMarker={(marker: Marker) => {
                      setMarkers([...markers, marker]);
                    }}
                    alt="Imagem do produto"
                    width={250}
                    height={250}
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
            <Box flex={1} m={2}>
              <label htmlFor="descricao">Descrição</label>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              if (dataEdit.id) {
                handlePutPlantaBaixa(
                  dataEdit.id,
                  descricao,
                  andar_id,
                  imageProd,
                  markers
                );
              } else {
                handlePostPlantaBaixa(descricao, andar_id, imageProd, markers);
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}