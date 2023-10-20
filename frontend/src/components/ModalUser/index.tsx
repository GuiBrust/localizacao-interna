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
  Switch,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { setupAPIClient } from "../../services/api";

async function handlePostUser(
  nome: string,
  user: string,
  senha: string,
  setData: any
) {
  try {
    const apiClient = setupAPIClient();

    await apiClient.post("/users", {
      nome,
      user,
      senha,
    });

    const response = await apiClient.get("/users");
    setData(response.data);
  } catch {
    toast.error("Erro ao cadastrar usuário!");
  }
}

async function handlePutUser(
  id: string,
  nome: string,
  user: string,
  senha: string,
  ativo: boolean,
  setData: any
) {
  try {
    const apiClient = setupAPIClient();

    await apiClient.put("/users", {
      id,
      nome,
      user,
      senha,
      ativo,
    });

    const response = await apiClient.get("/users");
    setData(response.data);
  } catch (error) {
    toast.error("Erro ao alterar usuário!");
  }
}

const ModalUser = ({
  data,
  setData,
  dataEdit,
  isOpen,
  onClose,
  setUserList,
}) => {
  const [nome, setNome] = useState(dataEdit.nome || "");
  const [user, setUser] = useState(dataEdit.user || "");
  const [ativo, setAtivo] = useState(dataEdit.ativo);
  const [senha, setSenha] = useState(dataEdit.senha || "");
  const isEdit = dataEdit.id;

  const handleSave = () => {
    if (dataEdit.id === undefined) {
      handlePostUser(nome, user, senha, setUserList);
    } else {
      handlePutUser(dataEdit.id, nome, user, senha, ativo, setUserList);
    }

    onClose();
    toast.success("Usuário salvo com sucesso!");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEdit ? "Editar Usuário" : "Adicionar Usuário"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" flexDir="column" gap={4}>
              <Box>
                <FormLabel>Nome</FormLabel>
                <Input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Usuário</FormLabel>
                <Input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Ativo</FormLabel>
                <Switch
                  size="lg"
                  colorScheme="green"
                  onChange={(e) => setAtivo(e.target.checked)}
                  isChecked={isEdit ? ativo : true}
                  isDisabled={!isEdit}
                />
              </Box>
              <Box>
                <FormLabel>{isEdit ? "Alterar Senha" : "Senha"}</FormLabel>
                <Input
                  type="text"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent="start">
            <Button colorScheme="green" mr={3} onClick={handleSave}>
              SALVAR
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              CANCELAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUser;
