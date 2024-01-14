import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import logoImg from "../../public/unoesc-logo-header.svg";
import { fetchSvgContent } from "../utils/pdfUtils";

async function geraPDF(info) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const svgContent = await fetchSvgContent(logoImg.src);

  const { nome, linkQrCode } = info;
  const data = format(new Date(), "dd/MM/yyyy");

  const docDefinition = {
    pageMargins: [20, 20, 20, 20],
    content: [
      {
        svg: svgContent,
        height: 50,
        width: 150,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      { text: "Localizar Ambientes", style: "header" },
      { text: `${nome}`, style: "subheader" },
      {
        qr: linkQrCode,
        eccLevel: "H",
        fit: 500,
        alignment: "center",
        margin: [0, 20, 0, 20],
      },
      { text: "Instruções de Uso:", style: "subheader" },
      {
        ul: [
          "Escaneie o QR Code com o seu dispositivo.",
          "Descubra sua localização atual na faculdade.",
        ],
        margin: [0, 0, 0, 20],
      },
      { link: linkQrCode, text: linkQrCode, style: "subheader" },
      { text: data, style: "footer", alignment: "center" },
    ],

    styles: {
      header: { fontSize: 25, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 5] },
      footer: { fontSize: 12, margin: [0, 20, 0, 0] },
    },
  };

  pdfMake.createPdf(docDefinition).open();
}

export default geraPDF;
