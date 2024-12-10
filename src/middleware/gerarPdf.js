const puppeteer = require('puppeteer');
const ejs = require('ejs');
const axios = require('axios');
const { Blob } = require('@vercel/blob');

const generatePdf = async (dadosLocador) => {
  try {
    // URL do modelo de contrato no Vercel Blob
    const templateUrl = "https://qsgsksirv7fkvuvt.public.blob.vercel-storage.com/modeloContrato/modeloContrato.ejs";

    // Baixa o modelo de contrato
    const response = await axios.get(templateUrl);
    const templateContent = response.data;

    // Renderiza o HTML usando os dados fornecidos
    const html = ejs.render(templateContent, dadosLocador);

    // Inicializa o Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

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

    await browser.close();

    // Salva o PDF no Vercel Blob
    const blobResponse = await Blob.upload({
      data: pdfBuffer,
      contentType: 'application/pdf',
      name: `contratos/gerados/contratoPreenchido_${dadosLocador.nomeLocador}.pdf`,
    });

    // Retorna a URL do PDF salvo
    return blobResponse.url;

  } catch (error) {
    console.error('Erro no processo de geração de PDF:', error);
    throw error;
  }
};

module.exports = { generatePdf };
