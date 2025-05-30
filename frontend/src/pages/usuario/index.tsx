import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ModalUser from "../../components/ModalUser";
import ConfirmModal from "../../components/ConfirmModal";

import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";

type UserProps = {
  id: number;
  nome: string;
  user: string;
  senha: string;
  ativo: boolean;
};

interface UsuarioProps {
  users: UserProps[];
}

export default function Usuario({ users }: UsuarioProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataEdit, setDataEdit] = useState({});
  const [userList, setUserList] = useState(users || []);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const openConfirmModal = (id) => {
    setUsuarioToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  useEffect(() => {
    setUserList(users);
  }, [users]);

  const handleRemove = async (id: number) => {
    // TODO verificar se o usuário é o que está logado

    // TODO menesagem de confirmação

    try {
      const apiClient = setupAPIClient();
      await apiClient.delete("users", { data: { id } });
      setUserList(userList.filter((user) => user.id !== id));
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir usuário!");
    }
  };

  return (
    <>
      <Head>
        <title>Usuário</title>
      </Head>
      <Header />

      <Flex
        h="100vh"
        align="center"
        justify="center"
        fontSize="20px"
        fontFamily="poppins"
      >
        <Box maxW={1200} w="100%" h="100vh" py={10} px={2}>
          <Button
            colorScheme="blue"
            onClick={() => [setDataEdit({}), onOpen()]}
            mb={5}
            ml={5}
          >
            Adicionar
          </Button>
          
          <Box overflowY="auto" height="100%">
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th fontSize="20px">Nome</Th>
                    <Th fontSize="20px">Usuário</Th>
                    <Th fontSize="20px">Ativo</Th>
                    <Th p={0}></Th>
                    <Th p={0}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userList.map(({ id, nome, user, ativo }, index) => (
                    <Tr
                      key={index}
                      cursor="pointer "
                      _hover={{ bg: "gray.100" }}
                    >
                      <Td>{nome}</Td>
                      <Td>{user}</Td>
                      <Td>{ativo ? "Sim" : "Não"}</Td>
                      <Td p={0}>
                        <EditIcon
                          color="blue.500"
                          fontSize={20}
                          onClick={() => [
                            setDataEdit({ id, nome, user, ativo }),
                            onOpen(),
                          ]}
                        />
                      </Td>
                      <Td p={0}>
                        <DeleteIcon
                          color="red.500"
                          fontSize={20}
                          onClick={() => openConfirmModal(id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        {isOpen && (
          <ModalUser
            isOpen={isOpen}
            onClose={onClose}
            data={userList}
            setData={setUserList}
            dataEdit={dataEdit}
            setUserList={setUserList}
          />
        )}
        {isConfirmModalOpen && (
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmModal}
            onConfirm={() => {
              handleRemove(usuarioToDelete);
              closeConfirmModal();
            }}
            title="Confirmação de Exclusão"
            description="Tem certeza de que deseja excluir este Usuário?"
          />
        )}
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/users");

  return {
    props: {
      users: response.data,
    },
  };
});
