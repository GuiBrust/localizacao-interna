import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ConfirmModal from "../../components/ConfirmModal";
import ModalPlantaBaixa from "../../components/ModalPlantaBaixa";

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

type PlantaBaixaProps = {
  id: number;
  descricao: string;
  bloco_id: number;
};

interface PlantaBaixaProps {
  plantas_baixas: PlantaBaixaProps[];
}

export default function PlantaBaixa({ plantas_baixas }: PlantaBaixaProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataEdit, setDataEdit] = useState({});
  const [dataList, setDataList] = useState(plantas_baixas || []);

  useEffect(() => {
    setDataList(plantas_baixas);
  }, [plantas_baixas]);

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
      await apiClient.delete('/salas/planta_baixa/' + id);
      await apiClient.delete("plantas_baixas/" + id);
      setDataList(dataList.filter((andar) => andar.id !== id));
      toast.success("Planta Baixa removida com sucesso!");
    } catch {
      toast.error("Erro ao remover Planta Baixa!");
    }
  };

  return (
    <>
      <Head>
        <title>Planta Baixa</title>
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
                    <Th fontSize="20px">Descrição</Th>
                    <Th fontSize="20px">Bloco</Th>
                    <Th fontSize="20px">Andar</Th>
                    <Th p={0}></Th>
                    <Th p={0}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataList.map(({ id, descricao, andar, imagem }, index) => (
                    <Tr
                      key={index}
                      cursor="pointer "
                      _hover={{ bg: "gray.100" }}
                    >
                      <Td>{descricao}</Td>
                      <Td>{andar.bloco.descricao}</Td>
                      <Td>{andar.descricao}</Td>
                      <Td p={0}>
                        <EditIcon
                          color="blue.500"
                          fontSize={20}
                          onClick={() => {
                            setDataEdit({ id, descricao, andar, imagem });
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
          <ModalPlantaBaixa
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
            description="Tem certeza de que deseja excluir esta Planta Baixa? Ao fazer isso, todas as Salas vinculadas a ela também serão excluídas."
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
  const response = await apiClient.get("/plantas_baixas");
  const plantas_baixas = response.data;

  return {
    props: {
      plantas_baixas,
    },
  };
});
