const express = require("express");
const DownloadEbooks = express.Router();
const validarEbooks = require("../middleware/verificarSeExisteEbook");

// Alterando de POST para GET e usando params
DownloadEbooks.get("/baixar/:nomeDoArquivo", validarEbooks, (req, res) => {
  const { nomeDoArquivo } = req.params;

  try {
    console.log("Iniciando download para o arquivo:", nomeDoArquivo);
    console.log("Caminho completo do arquivo:", req.filePath);

    // Definindo o cabeçalho manualmente (opcional)
    res.setHeader("Content-Disposition", `attachment; filename="${nomeDoArquivo}"`);
    res.setHeader("Content-Type", "application/pdf");

    res.download(req.filePath, nomeDoArquivo, (err) => {
      if (err) {
        console.error("Erro durante o download do arquivo:", err);
        res.status(500).send("Erro ao iniciar o download.");
      } else {
        console.log("Download concluído com sucesso.");
      }
    });
  } catch (error) {
    console.error("Erro inesperado ao baixar o Ebook:", error);
    res.status(500).send("Erro inesperado ao baixar o ebook");
  }
});

module.exports = DownloadEbooks;
