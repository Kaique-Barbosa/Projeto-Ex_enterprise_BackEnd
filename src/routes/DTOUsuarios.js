const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bycrypy = require("bcrypt");
const { gerarToken, verificarToken } = require("../services/jwtToken");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const prisma = new PrismaClient();
const usuario = express.Router();

// rota para listar todos os usuarios
usuario.get("/", verificarRota, async (req, res) => {
  // avaliar a utilização desse verificar rota,
  // pois agr o token é armazanado em cookie
  try {
    const usuarios = await prisma.user.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json("Erro ao buscar usuarios", error);
  }
});

// rota para login

usuario.post("/login", verificarRota, async (req, res) => {
  try {
    if(req.tokenVerificado){
      return res.status(400).json({ status: "failed", message: "Usuário já está logado"})
    }

    const { email, senha } = req.body;

    const usuario = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      return res
        .status(401)
        .json({ status: "failed", message: "Usuario não encontrado" });
    }

    const verificarSenha = await bycrypy.compare(senha, usuario.senha);

    if (!verificarSenha) {
      return res
        .status(401)
        .json({ status: "failed", message: "Senha incorreta" });
    }

    const dados = {
      usuario: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
    };

    const token = gerarToken(dados, res);

    return res
      .status(200)
      .json({ status: "ok", message: "Usuario encontrado", token: token});
  } catch (error) {
    console.log("Erro: ", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

usuario.post("/cadastrar", async (req, res) => {
  try {
    const { nome, sobrenome, email, telefone, senha } = req.body;

    if (!nome || !email || !senha || !sobrenome || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }
    const senhaEncripty = await bycrypy.hash(senha, 10);

    const usuario = await prisma.user.create({
      data: {
        nome,
        sobrenome,
        email,
        telefone,
        senha: senhaEncripty,
      },
    });

    const dados = {
      usuario: usuario.id,
      email: usuario.email,
      senha: usuario.senha,
    };
    const token = gerarToken(dados, res);

    res
      .status(200)
      .json({ message: "Usuario Criado com sucesso", token: token });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar usuário", details: error.message });
  }
});

usuario.put("/:id", async (req, res) => {
  const token = req.cookies.token; // pegando o token dos cookies

  if (!token) {
    return res.status(401).json({ error: "Não autorizado" });
  }

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
    console.log(usuarioAtualizado);
    // na resposta abaixo já esta retornando o valor do usuario atualizado para que
    //não seja preciso fazer um novo fetch para atualização

    const dados = verificarToken(token);

    if (verificarToken) {
      res.status(201).json({ message: "Usuario atualizado com sucesso" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar usuario",
      message: "Erro ao atualizar usuario",
    });
  }
});

usuario.delete("/:id", async (req, res) => {
  const token = req.cookies.token; // pegando o token dos cookies

  if (!token) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const dados = verificarToken(token);

    const { id } = req.params;

    if (dados) {
      await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
    }

    // Limpar o cookie do JWT
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ message: "Usuario deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuario" });
  }
});

module.exports = usuario;
