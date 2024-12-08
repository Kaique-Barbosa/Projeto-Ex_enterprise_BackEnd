const jwt = require('jsonwebtoken');

// Geração do token e salvamento no cookie
const gerarToken = (user, res) => {
  if (!process.env.JWT_SECRETO) {
    throw new Error('Chave secreta JWT não definida em process.env.JWT_SECRETO');
  }
  // lembrar de mudar o tempo de expiração dos tokens itualmente, tanto na geração quanto no coockies
  const token = jwt.sign(user, process.env.JWT_SECRETO, { expiresIn: '5m' });

  // Salvar o token no cookie
  res.cookie('token', token, {
    httpOnly: true,  // O cookie não será acessível via JavaScript no navegador
    secure: false, // Apenas em dev (modificar para true em produção)
    maxAge: 5 * 60 * 1000, // Expira em 5 minutos (em milissegundos)
    // posteriormente mudar para: 60 * 60 * 1000 (1h)
    sameSite: 'None'
  });

  return token; // Retorna o token caso seja necessário usá-lo
};

// Verificação do token
const verificarToken = (token) => {
  if (!process.env.JWT_SECRETO) {
    throw new Error('Chave secreta JWT não definida em process.env.JWT_SECRETO');
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRETO);
  } catch (err) {
    throw new Error('Token inválido ou expirado');
  }
};

module.exports = {
  gerarToken,
  verificarToken,
};
