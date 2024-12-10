const express = require("express");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const { generatePdf } = require("../middleware/gerarPdf");

const rotaPdf = express.Router();

rotaPdf.post("/gerar", verificarRota, async (req, res) => {
  const dadosLocador = req.body;

  try {
    // Gera o PDF e obtém a URL do arquivo no Vercel Blob
    const pdfUrl = await generatePdf(dadosLocador);

    // Retorna a URL do arquivo PDF salvo no Vercel Blob
    res.status(200).json({ url: pdfUrl });
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    res.status(500).send("Erro ao gerar o PDF");
  }
});

module.exports = rotaPdf;
