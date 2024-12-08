const path = require("path");
const fs = require("fs");

// Middleware para verificar se o arquivo existe
const validarEbooks = (req, res, next) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({
      error: "Erro no nome do arquivo. Por favor, forneça um nome válido.",
    });
  }

  const filePath = path.join(__dirname, "../assets/ebooks", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Arquivo não encontrado." });
  }

  req.filePath = filePath;
  next();
};

module.exports = validarEbooks;
