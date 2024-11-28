// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');

// inportando rotas
const usuario = require('./routes/TDOUsuarios')
const verificarToken = require('./routes/verificarToken')
const gerarContrato = require('./routes/gerarContrato')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para parsing de cookies
app.use(cookieParser()); // necessario para manipular os tokens, foi instalado


//Inportação do Fluxo de rotas:
app.use("/usuario", usuario)
app.use("/verificarToken", verificarToken) // rota para verificar token no front
app.use("/pdf", gerarContrato) // rota paragerar o contrato preenchido

module.exports = app;
