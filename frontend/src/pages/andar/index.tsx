import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Andar(){
  return (
    <>
      <Head>
        <title>Andar</title>
      </Head>
      <Header />
      <div>
        <h1>Andar</h1>
      </div>
    </>
  );  
}