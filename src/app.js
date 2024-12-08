// src/app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// inportando rotas
const usuario = require("./routes/DTOUsuarios");
const verificarToken = require("./routes/verificarToken");
const gerarContrato = require("./routes/gerarContrato");
const DownloadEbooks = require("./routes/DownloadEbooks");
const imoveis = require("./routes/DTOimoveis");

const app = express();

app.use(
  cors({
    origin: ["https://ex-enterprise.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para parsing de cookies
app.use(cookieParser()); // necessario para manipular os tokens, foi instalado

//Inportação do Fluxo de rotas:
app.use("/usuario", usuario);
app.use("/imoveis", imoveis);
app.use("/verificarToken", verificarToken); // rota para verificar token no front
app.use("/pdf", gerarContrato); // rota paragerar o contrato preenchido
app.use("/ebooks", DownloadEbooks); // rota fazesr download dos ebooks

module.exports = app;
