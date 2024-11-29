const { verificarToken } = require("../services/jwtToken");

const verificarTokenLogin = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      verificarToken(token);
      req.tokenVerificado = token;
      console.log("Usuário já está logado");
    } catch (error) {
      // Token é inválido, continua para o login
      console.log("Token inválido, prosseguindo para login");
    }
  }
  
  next();
};

module.exports = verificarTokenLogin;
