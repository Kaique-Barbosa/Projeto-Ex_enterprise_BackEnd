
const { gerarToken, verificarToken } = require("../services/jwtToken");

// script para verificar validação jwt para a rota passada

const verificar = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Pegando o token do header Authorization
    if(!token){
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    verificarToken(token)

   

    next()
}
module.exports = verificar;

// usuario.get('/protegido', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Pegando o token do header Authorization
//   if (!token) {
//       return res.status(401).json({ error: 'Token não fornecido' });
//   }

//   try {
//       const decoded = verificarToken(token);
//       res.json({ message: 'Rota protegida acessada!', user: decoded });
//   } catch (err) {
//       res.status(401).json({ error: err.message });
//   }
// });

// usuario.post('/login', (req, res) => {
//   const { userId } = req.body; // Supondo que o ID do usuário foi autenticado
//   const token = gerarToken(userId);
//   res.json({ token });
// });
