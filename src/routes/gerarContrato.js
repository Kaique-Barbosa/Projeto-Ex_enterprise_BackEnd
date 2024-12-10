const express = require("express");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const { generatePdf } = require("../middleware/gerarPdf");
const axios = require("axios");

const rotaPdf = express.Router();

rotaPdf.post("/gerar", verificarRota, async (req, res) => {
  const dadosLocador = req.body;

  try {
    // Gera o PDF e obtém a URL do arquivo no Vercel Blob
    const pdfUrl = await generatePdf(dadosLocador);

    // Faz o download do PDF diretamente do Vercel Blob
    const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
    const pdfBuffer = response.data;

    // Configura os cabeçalhos de resposta para forçar o download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=contratoPreenchido_${dadosLocador.nomeLocador}.pdf`,
    });

    // Envia o arquivo como resposta
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar o PDF ou enviá-lo:", error);
    res.status(500).send("Erro ao gerar o PDF");
  }
});

module.exports = rotaPdf;
