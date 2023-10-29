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
import { setupAPIClient } from "../services/api";

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

  useEffect(() => {
    async function fetchBlocos() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/blocos");
        setOpcoesBlocos(response.data);
      } catch {
        toast.error("Erro ao buscar opções de blocos!");
      }
    }

    async function fetchAndares() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/andares/" + bloco_id);
        setOpcoesAndares(response.data);
      } catch {
        toast.error("Erro ao buscar opções de andares!");
      }
    }

    if (isOpen) {
      fetchBlocos();
      fetchAndares();
    }
  }, [bloco_id, isOpen]);

  async function handlePostPlantaBaixa(descricao: string, bloco_id: number) {
    try {
      const apiClient = setupAPIClient();

      await apiClient.post("/plantas_baixas", {
        descricao,
        bloco_id: Number(bloco_id),
      });

      const response = await apiClient.get("/plantas_baixas");
      setData(response.data);
      toast.success("Planta baixa cadastrada com sucesso!");
    } catch {
      toast.error("Erro ao cadastrar planta baixa!");
    }
  }

  async function handlePutPlantaBaixa(
    id: string,
    descricao: string,
    bloco_id: number
  ) {
    try {
      const apiClient = setupAPIClient();

      await apiClient.put("/plantas_baixas/" + id, {
        descricao,
        bloco_id,
      });

      const response = await apiClient.get("/plantas_baixas");
      setData(response.data);
      toast.success("Planta baixa atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar planta baixa!");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {dataEdit.id ? "Editar planta baixa" : "Cadastrar planta baixa"}
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
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              if (dataEdit.id) {
                handlePutPlantaBaixa(dataEdit.id, descricao, andar_id);
              } else {
                handlePostPlantaBaixa(descricao, andar_id);
              }
              onClose();
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
