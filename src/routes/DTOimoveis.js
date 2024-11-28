const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bycrypy = require("bcrypt");
const { gerarToken, verificarToken } = require("../services/jwtToken");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const prisma = new PrismaClient();
const imoveis = express.Router();

imoveis.get('/listar', (req, res) => {
  
})


imoveis.post('/cadastrar', function (req, res) {
  
})


imoveis.put('/', function(req, res) {
  const { id, name, description } = req.body;
 
});


imoveis.delete('/:id', function(req, res) {
  const { id } = req.params;
  
});