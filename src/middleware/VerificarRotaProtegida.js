const { verificarToken } = require("../services/jwtToken");

const verificar = (req, res, next) => {
  // Pegando o token do cookie "authToken"
  const token = req.cookies.token;

  // if (!token) {
  //     return res.status(401).json({ message: "Token não fornecido" });
  // }

  if (token) {
      try {
        // Verifica o token
        verificarToken(token);
        // Adiciona o token verificado ao req para verificar se já esta logado com token valido
        req.tokenVerificado = token;
      } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
      }
  }


  next();
};

module.exports = verificar;
