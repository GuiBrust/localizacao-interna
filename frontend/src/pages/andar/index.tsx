import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ModalAndar from "../../components/ModalAndar";
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

type AndarProps = {
  id: number;
  descricao: string;
  bloco_id: number;
};

interface AndarProps {
  andares: AndarProps[];
}

export default function Andar({ data }: AndarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataEdit, setDataEdit] = useState({});
  const [dataList, setDataList] = useState(data || []);

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState(null);

  const openConfirmModal = (id) => {
    setBlockToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleRemove = async (id: number) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete("andares/" + id);
      setDataList(dataList.filter((andar) => andar.id !== id));
      toast.success("Andar removido com sucesso!");
    } catch {
      toast.error("Erro ao remover andar!");
    }
  };

  return (
    <>
      <Head>
        <title>Andar</title>
      </Head>
      <Header />
      <Flex
        h="100vh"
        align="center"
        justify="center"
        fontSize="20px"
        fontFamily="poppins"
      >
        <Box maxW={800} w="100%" h="100vh" py={10} px={2}>
          <Button
            colorScheme="blue"
            onClick={() => {
              setDataEdit({});
              onOpen();
            }}
          >
            Adicionar
          </Button>

          <Box overflowY="auto" height="100%">
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th fontSize="20px">Descrição</Th>
                    <Th fontSize="20px">Bloco</Th>
                    <Th p={0}></Th>
                    <Th p={0}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataList.map(({ id, descricao, bloco, bloco_id }, index) => (
                    <Tr
                      key={index}
                      cursor="pointer "
                      _hover={{ bg: "gray.100" }}
                    >
                      <Td>{descricao}</Td>
                      <Td>{bloco.descricao}</Td>
                      <Td p={0}>
                        <EditIcon
                          color="blue.500"
                          onClick={() => {
                            setDataEdit({ id, descricao, bloco_id });
                            onOpen();
                          }}
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
          <ModalAndar
            isOpen={isOpen}
            onClose={onClose}
            dataEdit={dataEdit}
            setData={setDataList}
          />
        )}
        {isConfirmModalOpen && (
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmModal}
            title="Confirmação de Exclusão"
            description="Tem certeza que deseja remover este Andar?"
            onConfirm={() => {
              handleRemove(blockToDelete);
              closeConfirmModal();
            }}
          />
        )}
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/andares");
  const data = response.data;

  return {
    props: {
      data,
    },
  };
});
