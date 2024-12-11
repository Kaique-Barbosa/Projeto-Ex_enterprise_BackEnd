const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const { generatePdf } = require("../middleware/gerarPdf");
const rotaPdf = express.Router();
const prisma = new PrismaClient();

// adicionar depois o verificarRota abaixo
rotaPdf.post("/gerar", async (req, res) => {
  const { imovelCod, ...dadosLocador } = req.body;

  const imovel = await prisma.imovel.findFirst({
    where: { codigo: imovelCod },
  });

  // Validação simples dos dados (ajuste conforme necessário)
  if (!dadosLocador || !dadosLocador.nomeLocador) {
    return res
      .status(400)
      .json({ error: "Dados inválidos, nome do locador é obrigatório." });
  }

  if (!imovel) {
    return res.status(404).json({ error: "Imóvel não encontrado." });
  }

  const enderecoImovel = imovel.endereco.split(", ");

  const dadosParaContrato = {
    ...dadosLocador,
    logradouroImovel: enderecoImovel[0],
    numeroImovel: enderecoImovel[1],
    cidadeImovel: enderecoImovel[2],
    prazoLocacao: "12",
    valorMulta: "500,00",
    valorMultaExtenso: "quinhentos reais",
    valorLocacao: imovel.valorAlocacao + ",00",
    valorLocacaoExtenso: "três mil reais",
    diaPagamentoLocacao: "5",
    porcentagemMulta: "2",
    porcentagemMultaExtenso: "dois por cento",
    jurosMora: "1",
    jurosMoraExtenso: "um por cento",
    limiteDiasAtrasoPagamento: "5",
    prazoServico: "12",
    servicos: ["Pintura", " Encanamento", " Elétrica", " Limpeza"],
  };

  try {
    // Gera o PDF e realiza o upload no Vercel Blob
    const { url } = await generatePdf(dadosParaContrato);

    // Retorna a URL do arquivo salvo no Vercel Blob
    res.status(200).json({
      message: "PDF gerado com sucesso.",
      url: url,
    });
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error.message);
    res.status(500).json({ error: "Erro ao gerar o PDF." });
  }
});

module.exports = rotaPdf;
