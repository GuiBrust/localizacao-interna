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
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { setupAPIClient } from "../services/api";

async function handlePostBloco(descricao: string, setData: any) {
  try {
    const apiClient = setupAPIClient();

    await apiClient.post("/blocos", {
      descricao,
    });

    const response = await apiClient.get("/blocos");
    setData(response.data);
    toast.success("Bloco cadastrado com sucesso!");
  } catch {
    toast.error("Erro ao cadastrar bloco!");
  }
}

async function handlePutBloco(id: string, descricao: string, setData: any) {
  try {
    const apiClient = setupAPIClient();

    await apiClient.put("/blocos/" + id, {
      descricao,
    });

    const response = await apiClient.get("/blocos");
    setData(response.data);
    toast.success("Bloco atualizado com sucesso!");
  } catch {
    toast.error("Erro ao atualizar bloco!");
  }
}

export default function ModalBloco({ isOpen, onClose, dataEdit, setData }) {
  const [descricao, setDescricao] = useState(dataEdit.descricao || "");

  const handlePost = async () => {
    await handlePostBloco(descricao, setData);
    onClose();
  };

  const handlePut = async () => {
    await handlePutBloco(dataEdit.id, descricao, setData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{dataEdit.id ? "Editar" : "Adicionar"} Bloco</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Input
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={dataEdit.id ? handlePut : handlePost}
          >
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
