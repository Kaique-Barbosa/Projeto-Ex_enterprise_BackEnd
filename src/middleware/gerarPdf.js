const axios = require("axios"); // Importação do axios
const handlebars = require("handlebars");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { put } = require("@vercel/blob"); // SDK do Vercel Blob

// URL do Vercel Blob (Você pode ajustar essa URL conforme seu serviço no Vercel)


const generatePdf = async (dadosLocador) => {
  try {
    // URL do template no Vercel Blob
    const templateUrl = "https://qsgsksirv7fkvuvt.public.blob.vercel-storage.com/modeloContrato/modeloContrato.hbs";
    const tokenvalor = "vercel_blob_rw_qsgSkSirv7fkVuvT_0HEnX41nm6ZQCenhQn16gOuTfxy2Nb"

    // Faz a requisição HTTP para buscar o template
    const response = await axios.get(templateUrl);

    const templateContent = response.data;
    console.log("Conteúdo do template:", templateContent.slice(0, 100)); // Log do início do conteúdo (para evitar mostrar muito conteúdo)

    // Compila o template com Handlebars
    const parseTemplate = handlebars.compile(templateContent);
 
    // Gera o HTML com as variáveis fornecidas
    const parsedHTML = parseTemplate(dadosLocador);

    // Inicializa o Puppeteer para criar o PDF
    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(), // Caminho do Chromium
      args: chromium.args, // Argumentos do Chromium
      headless: chromium.headless, // Modo headless (sem interface)
    });
    const page = await browser.newPage();  // Criação da página
    console.log("Página criada no Puppeteer.");

    // Define o conteúdo HTML na página
    await page.setContent(parsedHTML);
    await page.emulateMediaType("screen");

    // Gera o PDF em buffer
    console.log("Gerando o PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",              // Define o tamanho da página
      printBackground: true,     // Garante que o fundo seja impresso
      margin: {                  // Defina margens para evitar cortes
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      scale: 1,                  // Escala o conteúdo da página
      preferCSSPageSize: true,   // Usa o tamanho da página conforme o CSS (caso tenha)
    });

    console.log("PDF gerado com sucesso.");

    // -------------------------- INÍCIO DO UPLOAD PARA O VERCEL BLOB --------------------------

    // Preparando o nome do arquivo no Vercel Blob
    const fileName = `contratos/contrato_${dadosLocador.nomeLocador}.pdf`;
    // Envia o arquivo para o Vercel Blob usando o método 'put' do SDK
    const  url  = await put(fileName, pdfBuffer, {
      contentType: "application/pdf", 
      addRandomSuffix: false,
      token: tokenvalor,
      access: 'public',
    });

    // -------------------------- FIM DO UPLOAD PARA O VERCEL BLOB --------------------------

    await browser.close();
    console.log("Puppeteer fechado.");

    return {pdfBuffer, url}; // Retorna o buffer do PDF para posterior envio ou outro uso
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
};

module.exports = { generatePdf };