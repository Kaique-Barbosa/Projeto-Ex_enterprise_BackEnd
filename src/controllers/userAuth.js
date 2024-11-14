const express = require('express')
const {PrismaClient} = require('@prisma/client')
const jwtToken = require('jsonwebtoken')
const bycript = require('bcrypt')

const prima = new PrismaClient()
const userRoute = express.Router()

userRoute.post('/register', async (req, res) {
    try {
        const {email, senha} = req.body
        const senhaEncripty = await bycript.hash(senha, 10)
        
        res.status(200).json({message: "Usuario autenticado"})
    } catch (error) {
        
        res.status(200).json({message: "Erro ao fazer login"})
    }
})

userRoute.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

userRoute.put('/:id', function(req, res) {
  const { id, name, description } = req.body;
  res.send(`Name ${id} ${name}, desc ${description}`);
});

userRoute.delete('/:id', function(req, res) {
  const { id } = req.params;
  res.send(`Delete record with id ${id}`);
});

