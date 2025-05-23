const express = require("express");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const { generatePdf } = require("../middleware/gerarPdf"); 
const rotaPdf = express.Router();

rotaPdf.post("/gerar", verificarRota, async (req, res) => {
  const dadosLocador = req.body;

  // Validação simples dos dados (ajuste conforme necessário)
  if (!dadosLocador || !dadosLocador.nomeLocador) {
    return res.status(400).json({ error: "Dados inválidos, nome do locador é obrigatório." });
  }

  try {
    // Gera o PDF e realiza o upload no Vercel Blob
    const {url} = await generatePdf(dadosLocador);

    // Retorna a URL do arquivo salvo no Vercel Blob
    res.status(200).json({
      message: "PDF gerado com sucesso.",
      url: url,
    });
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error.message);
    res.status(500).json({ error: "Erro ao gerar o PDF." });
  }
});

module.exports = rotaPdf;
