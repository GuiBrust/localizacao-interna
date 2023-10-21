import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Select,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { setupAPIClient } from "../services/api";

async function handlePostAndar(
  descricao: string,
  bloco_id: number,
  setData: any
) {
  try {
    const apiClient = setupAPIClient();

    await apiClient.post("/andares", {
      descricao,
      bloco_id: Number(bloco_id),
    });

    const response = await apiClient.get("/andares");
    setData(response.data);
    toast.success("Andar cadastrado com sucesso!");
  } catch {
    toast.error("Erro ao cadastrar andar!");
  }
}

async function handlePutAndar(
  id: string,
  descricao: string,
  bloco_id: number,
  setData: any
) {
  try {
    const apiClient = setupAPIClient();

    await apiClient.put("/andares/" + id, {
      descricao,
      bloco_id,
    });

    const response = await apiClient.get("/andares");
    setData(response.data);
    toast.success("Andar atualizado com sucesso!");
  } catch {
    toast.error("Erro ao atualizar andar!");
  }
}

export default function ModalAndar({ isOpen, onClose, dataEdit, setData }) {
  const [descricao, setDescricao] = useState(dataEdit.descricao || "");
  const [bloco_id, setBloco_id] = useState(dataEdit.bloco_id || "");
  const [opcoes_blocos, setOpcoesBlocos] = useState([]);

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

    if (isOpen) {
      fetchBlocos();
    }
  }, [isOpen]);

  const handlePost = async () => {
    await handlePostAndar(descricao, bloco_id, setData);
    onClose();
  };

  const handlePut = async () => {
    await handlePutAndar(dataEdit.id, descricao, bloco_id, setData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {dataEdit.id ? "Editar Andar" : "Cadastrar Andar"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
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
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={dataEdit.id ? handlePut : handlePost}
          >
            {dataEdit.id ? "Editar" : "Cadastrar"}
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
