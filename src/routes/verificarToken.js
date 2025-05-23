const express = require("express");
const validarToken = express.Router();
const { gerarToken, verificarToken } = require("../services/jwtToken");
const jwt = require("jsonwebtoken");

// Essa rota é exclusiva para o front, caso precise validar o token presente nos cookies
validarToken.get("/", function (req, res) {
  try {
    // Pegar o token do cookie
    const token = req.cookies.token;

    // Verificar se o token existe
    if (!token) {
      throw new Error("Token não encontrado.");
    }

    // Pegar o payload do token
    const payload = jwt.decode(token);

    // Verificar se o token é válido
    verificarToken(token);

    // Se for válido, enviar a resposta positiva
    res.status(200).json({ valid: true, ...payload });
  } catch (error) {
    console.error("Erro ao validar token:", error.message);

    // Limpar o cookie antes de responder
    res.clearCookie("token");

    // Enviar a resposta de erro
    res.status(400).json({ valid: false, message: error.message });
  }
});

module.exports = validarToken;
