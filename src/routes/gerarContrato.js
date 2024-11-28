const express = require("express");
const verificarRota = require("../middleware/VerificarRotaProtegida");
const {generatePdf} = require('../middleware/gerarPdf')
// const fs = require("fs")
const rotaPdf = express.Router();

rotaPdf.post('/gerar', verificarRota, async(req, res) => {
  const dadosLocador = req.body

  try {
    // gera o pdf e recebe o caminho do arquivo
    const pdfPath = await generatePdf(dadosLocador)
    
    res.sendFile(pdfPath, (err)=>{
        if(err){
            console.error("erro ao enviar PDF: ", err)
            res.status(500).send("Erro ao enviar PDF")
        }
        // a biblioteca abaixo excluira o arquivo pdf apos o envio, 
        // sendo assim não ira ficar salvo na memoria do server

        // fs.unlink(pdfPath, (err) => {
        //     if (err) console.error("Erro ao deletar arquivo:", err);
        //   });
    })

  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    res.status(500).send("Erro ao gerar o PDF");
  }

})

module.exports = rotaPdf