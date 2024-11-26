// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');

// inportando rotas
const usuario = require('./routes/TDOUsuarios')
const verificarToken = require('./routes/verificarToken')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para parsing de cookies
app.use(cookieParser());


//Inportação do Fluxo de rotas:
app.use("/usuario", usuario)
app.use("/verificarToken", verificarToken) // rota para verificar token no front

module.exports = app;
