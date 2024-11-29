const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const prisma = new PrismaClient();
const imoveis = express.Router();

imoveis.get('/listar', async (req, res) => {
  try {
    const dados =  await prisma.imovel.findMany()
    res.status(200).json(dados);
  } catch (error) {
    res.status(500).json("Erro ao buscar imoveis", error);
  }
})

imoveis.post('/listar/:id', async (req, res) => {
  try {
    const {id} = req.params
    
    const dados =  await prisma.imovel.findFirst({
      where: {
        id: id
      }
    })

    if(dados === null){
      res.status(400).json("Imovel não consta no sistema");  
    }

    res.status(200).json(dados);
  } catch (error) {
    res.status(500).json("Erro ao buscar o imoveis", error);
  }
})


imoveis.post('/cadastrar',verificarRota, async (req, res) => {
  try {
    const { nome, endereco, disponibilidade, valorAlocacao, valorCondominio, valorIPTU, areaImovel, quantidadeQuartos, quantidadeBanheiros, vagasEstacionamento, descricao } = req.body

    if (!nome || !endereco || !disponibilidade || !valorAlocacao || !valorCondominio || !valorIPTU) {
      return res
        .status(400)
        .json({ error: "Os campos ( nome, endereco, disponibilidade, valorAlocacao, valorCondominio, valorIPTU ) são obrigatórios" });
    }
    

      const imovel = await prisma.imovel.create({
          data:{
            nome, 
            endereco, 
            disponibilidade,
            valorAlocacao, 
            valorCondominio, 
            valorIPTU, 
            areaImovel, 
            quantidadeQuartos,
            quantidadeBanheiros,
            vagasEstacionamento, 
            descricao
          }
      })
      res.status(200).json({ message: "Imovel adicionado com sucesso"});
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar imovel"});
  }
})


imoveis.put('/:id', verificarRota ,async (req, res) => {
  try {
    
    const {id} = req.params
    const { nome, endereco, disponibilidade, valorAlocacao, valorCondominio, valorIPTU, areaImovel, quantidadeQuartos, quantidadeBanheiros, vagasEstacionamento, descricao } = req.body
  
    const dados = await prisma.imovel.update({
      where:{
        id: id
      },
      data:{
        nome, 
        endereco, 
        disponibilidade,
        valorAlocacao, 
        valorCondominio, 
        valorIPTU, 
        areaImovel, 
        quantidadeQuartos,
        quantidadeBanheiros,
        vagasEstacionamento, 
        descricao
      }
    })
    res.status(200).json({message: "imovel atualizado com sucesso"})

  } catch (error) {
    res.status(500).json({message: "Não foi possivel atualizar o imovel"})
  }
 
});


imoveis.delete('/:id', verificarRota,  async (req, res) => {
  const { id } = req.params;

  try {
    // Verifique se o imóvel existe antes de deletar
    const imovel = await prisma.imovel.findUnique({
      where: { id: id }
    });

    if (!imovel) {
      return res.status(404).json({ message: "Imóvel não encontrado" });
    }

    await prisma.imovel.delete({
      where: { id: id }
    });

    res.status(200).json({ message: "Imóvel deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar o imóvel", error });
  }
});



module.exports = imoveis