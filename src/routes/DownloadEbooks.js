const express = require("express");
const DownloadEbooks = express.Router();
const validarEbooks = require("../middleware/baixarPdf");

DownloadEbooks.post("/baixar", validarEbooks, (req, res) => {
  const { filename } = req.body;

  try {
    res.download(req.filePath, filename, (err) => {
      if (err) {
        console.error("Erro durante o download do arquivo:", err);
      }
    });
  } catch (error) {
    console.error("Erro inesperado ao baixar o Ebook:", error);
    res.status(500).send("Erro inesperado ao baixar o ebook");
  }
});

module.exports = DownloadEbooks;
