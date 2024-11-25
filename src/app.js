// src/app.js
const express = require('express');

// inportando rotas
const usuario = require('./routes/TDOUsuarios')


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Inportação do Fluxo de rotas:
app.use("/usuario", usuario)




module.exports = app;
