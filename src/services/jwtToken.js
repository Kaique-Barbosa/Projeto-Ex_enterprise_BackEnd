const jwt = require('jsonwebtoken');

// Geração do token
/// OBS ESSE TOKEN USA PAR AO PAYLOAD SOMENTE O ID< CASO QUEIRA PASSAR MAIS PARAMETROS DEVERÀ MUDAR

const gerarToken = (userId) => {
    if (!process.env.JWT_SECRETO) {
        throw new Error('Chave secreta JWT não definida em process.env.JWT_SECRETO');
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRETO, { expiresIn: '5m' });
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
