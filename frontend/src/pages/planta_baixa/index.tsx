import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PlantaBaixa(){
  return (
    <>
      <Head>
        <title>Planta Baixa</title>
      </Head>
      <Header />
      <div>
        <h1>Planta Baixa</h1>
      </div>
    </>
  );  
}