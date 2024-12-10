const puppeteer = require('puppeteer');
const ejs = require('ejs');
const axios = require('axios');
const { Blob } = require('@vercel/blob');

const generatePdf = async (dadosLocador) => {
  try {
    // URL do modelo de contrato no Vercel Blob
    const templateUrl = "https://qsgsksirv7fkvuvt.public.blob.vercel-storage.com/modeloContrato/modeloContrato.ejs";
    console.log("URL do template:", templateUrl);

    // Baixa o modelo de contrato
    const response = await axios.get(templateUrl);
    console.log("Resposta do download do template:", response.status);
    const templateContent = response.data;
    console.log("Conteúdo do template:", templateContent);

    // Renderiza o HTML usando os dados fornecidos
    const html = ejs.render(templateContent, dadosLocador);
    console.log("HTML renderizado:", html);

    // Inicializa o Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    console.log("Puppeteer inicializado e HTML definido na página");

    // Gera o PDF a partir do conteúdo HTML
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '2cm'
      }
    });
    console.log("PDF gerado com sucesso");

    await browser.close();
    console.log("Navegador fechado");

    // Salva o PDF no Vercel Blob
    const blobResponse = await Blob.upload({
      data: pdfBuffer,
      contentType: 'application/pdf',
      name: `contratos/gerados/contratoPreenchido_${dadosLocador.nomeLocador}.pdf`,
    });
    console.log("PDF enviado para o Blob:", blobResponse.url);

    // Retorna a URL do PDF salvo
    return blobResponse.url;

  } catch (error) {
    console.error('Erro no processo de geração de PDF:', error);
    throw error;
  }
};

module.exports = { generatePdf };
