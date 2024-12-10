const express = require("express");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const { generatePdf } = require("../middleware/gerarPdf"); // Middleware para gerar PDF
const rotaPdf = express.Router();

// adicionar depois o verificarRota abaixo
rotaPdf.post("/gerar", async (req, res) => {
  const dadosLocador = req.body;

  // Validação simples dos dados (ajuste conforme necessário)
  if (!dadosLocador || !dadosLocador.nomeLocador) {
    return res.status(400).json({ error: "Dados inválidos, nome do locador é obrigatório." });
  }

  try {
    // Gera o PDF e realiza o upload no Vercel Blob
    const pdfBuffer = await generatePdf(dadosLocador);

    // Retorna a URL do arquivo salvo no Vercel Blob
    res.status(200).json({
      message: "PDF gerado com sucesso.",
      url: `https://qsgsksirv7fkvuvt.public.blob.vercel-storage.com/contratosGerados/contratoPreenchido_${dadosLocador.nomeLocador}.pdf`,
    });
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error.message);
    res.status(500).json({ error: "Erro ao gerar o PDF." });
  }
});

module.exports = rotaPdf;
