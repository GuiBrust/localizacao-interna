import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";

import React from "react";
import { DataGrid, GridRowsProp, GridColDef, ptBR } from "@mui/x-data-grid";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import geraPDF from "../../components/MyDocument";
import styles from "./styles.module.scss";

interface Bloco {
  id: number;
  descricao: string;
}

interface Andar {
  id: number;
  descricao: string;
  bloco_id: number;
  bloco: Bloco;
}

interface PlantaBaixa {
  id: number;
  descricao: string;
  andar_id: number;
  andar: Andar;
}

interface Sala {
  id: number;
  descricao: string;
  numero: number;
  planta_baixa_id: number;
  planta_baixa: PlantaBaixa;
}

const renderGerarQrCode = (params: any) => {
  if (params.tipo == "salas") {
    var nome = `Bloco: ${params.col6}, Andar: ${params.col5}, Sala: ${params.col2}`;
  } else {
    var nome = `Bloco: ${params.col1}`;
  }

  return (
    <Button
      colorScheme="blue"
      onClick={(e) =>
        geraPDF({
          nome: nome,
          linkQrCode: `http://${window.location.host}/busca_sala?sala_id=${params.id}&tipo=${params.tipo}`,
        })
      }
    >
      Gerar QrCode
    </Button>
  );
};

export default function Dashboard({ salas }: Sala) {
  const [campusData, setCampusData] = useState([]);

  const columns: GridColDef[] = [
    { field: "col2", headerName: "Sala", width: 150 },
    { field: "col3", headerName: "Número", width: 150 },
    { field: "col4", headerName: "Planta Baixa", width: 200 },
    { field: "col5", headerName: "Andar", width: 150 },
    { field: "col6", headerName: "Bloco", width: 150 },
    {
      field: "col7",
      headerName: "QrCode",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => {
        params.row.tipo = "salas";
        return renderGerarQrCode(params.row);
      },
    },
  ];

  const columnsCampus: GridColDef[] = [
    { field: "col1", headerName: "Bloco", width: 150 },
    {
      field: "col2",
      headerName: "QrCode",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        params.row.tipo = "campus";
        return renderGerarQrCode(params.row);
      },
    },
  ];

  const rows: GridRowsProp = salas.map((sala) => {
    return {
      id: sala.id,
      col2: sala.descricao,
      col3: sala.numero,
      col4: sala.planta_baixa.descricao,
      col5: sala.planta_baixa.andar.descricao,
      col6: sala.planta_baixa.andar.bloco.descricao,
    };
  });

  const fetchCampusData = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/plantas_baixas_bloco");

      const data = response.data;

      const rowsCampus: GridRowsProp = JSON.parse(data.marcacoesBloco).map(
        (item, index) => {
          return {
            id: index,
            col1: item.bloco_id,
          };
        }
      );

      setCampusData(rowsCampus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCampusData();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header />
      <Tabs>
        <TabList>
          <Tab>Salas</Tab>
          <Tab>Campus</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              localeText={ptBR.props.MuiDataGrid.localeText}
            />
          </TabPanel>
          <TabPanel>
            {campusData.length > 0 && (
              <DataGrid
                autoHeight
                rows={campusData}
                columns={columnsCampus}
                localeText={ptBR.props.MuiDataGrid.localeText}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/salas/all");
  const salas = response.data;

  return {
    props: {
      salas,
    },
  };
});
