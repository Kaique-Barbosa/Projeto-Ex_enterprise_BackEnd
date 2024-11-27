const express = require('express')
const validarToken = express.Router()
const { gerarToken, verificarToken } = require("../services/jwtToken");

// essa rota é exclusiv par ao front, caso precise validar o token presente no cookies

validarToken.get('/', function (req, res) {
    try {
        const token = req.cookies.token
        verificarToken(token)
        res.status(200).json(true)
    } catch (error) {
        console.log(error);
        res.status(400).json(false)
    }

})

module.exports = validarToken
