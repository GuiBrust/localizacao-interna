import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";

import React from "react";
import { DataGrid, GridRowsProp, GridColDef, ptBR } from "@mui/x-data-grid";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

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

export default function Dashboard({ salas }: Sala) {
  const columns: GridColDef[] = [
    { field: "col1", headerName: "ID", width: 100 },
    { field: "col2", headerName: "Sala", width: 150 },
    { field: "col3", headerName: "Número", width: 150 },
    { field: "col4", headerName: "Planta Baixa", width: 200 },
    { field: "col5", headerName: "Andar", width: 150 },
    { field: "col6", headerName: "Bloco", width: 150 },
    { field: "col7", headerName: "QrCode", width: 150 },
  ];

  const rows: GridRowsProp = salas.map((sala) => {
    return {
      id: sala.id,
      col1: sala.id,
      col2: sala.descricao,
      col3: sala.numero,
      col4: sala.planta_baixa.descricao,
      col5: sala.planta_baixa.andar.descricao,
      col6: sala.planta_baixa.andar.bloco.descricao,
      col7: "QrCode",
    };
  });

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
            {/* TODO implementar lista de marcações do campus */}
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
