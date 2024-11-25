const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bycripy = require("bcrypt");
const { gerarToken, verificarToken } = require("../services/jwtToken");
const verificarRota = require("../middleware/VerificarRotaProtegida")
const prisma = new PrismaClient();
const usuario = express.Router();


// rota para listar todos os usuarios
usuario.get("/", verificarRota, async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json("Erro ao buscar usuarios", error);
  }
});

// rota para login

usuario.post('/login', async (req, res) => {
 try {
   const {email, senha} = req.body
   const usuario = await prisma.user.findUnique({
    where:{
      email: email,
      senha: senha
    }
   
  });
  
   const token = gerarToken({usuario: usuario.id, email: usuario.email, senha: usuario.senha})
   
   res.status(200).json({usuario, token: token })

 } catch (error) {
  res.status(401).json({"message": "Erro Usuario não encontrado" })
 }
})

usuario.post("/cadastrar", async (req, res) => {
  try {
    const { nome, sobrenome, email, telefone, senha } = req.body;

    if (!nome || !email || !senha || !sobrenome || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }
    const senhaEncripty = await bycripy.hash(senha, 10);

    const usuario = await prisma.user.create({
      data: {
        nome,
        sobrenome,
        email,
        telefone,
        senha: senhaEncripty,
      },
    });

    const token = gerarToken({usuario: usuario.id, email: usuario.email, senha: usuario.senha})

    res.status(200).json({ message: "Usuario Criado com sucesso", token: token });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário", details: error.message });
  }
});

usuario.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, email, telefone, senha } = req.body;
   
    const usuarioAtualizado = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nome,
        sobrenome,
        email,
        telefone,
        senha,
      },
    });
  
    // na resposta abaixo já esta retornando o valor do usuario atualizado para que 
    //não seja preciso fazer um novo fetch para atualização
    verificarToken({usuario: usuario.id, email: usuario.email, senha: usuario.senha})
    
    if(verificarToken){
      res.status(201).json({message: "Produto Atualizado com sucesso", usuario: usuarioAtualizado})
    }

  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuario" });
  }
 
});

usuario.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where:{
        id: parseInt(id)
      },
    })
    res.status(200).json({ message: "Usuario deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuario" });
  }

});

module.exports = usuario;
