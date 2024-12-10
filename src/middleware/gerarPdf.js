const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium-min');
const ejs = require('ejs');
const axios = require('axios');
const { Blob } = require('@vercel/blob');

const generatePdf = async (dadosLocador) => {
  try {
    const templateUrl = "https://qsgsksirv7fkvuvt.public.blob.vercel-storage.com/modeloContrato/modeloContrato.ejs";
    console.log("URL do template:", templateUrl);

    const response = await axios.get(templateUrl);
    console.log("Resposta do download do template:", response.status);
    const templateContent = response.data;
    console.log("Conteúdo do template:", templateContent);

    const html = ejs.render(templateContent, dadosLocador);
    console.log("HTML renderizado:", html);

    const isLocal = process.env.AWS_EXECUTION_ENV === undefined;

    const browser = isLocal
      ? await require('puppeteer').launch()
      : await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });

    const page = await browser.newPage();
    await page.setContent(html);
    console.log("Puppeteer inicializado e HTML definido na página");

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

    const blobResponse = await Blob.upload({
      data: pdfBuffer,
      contentType: 'application/pdf',
      name: `contratos/gerados/contratoPreenchido_${dadosLocador.nomeLocador}.pdf`,
    });
    console.log("PDF enviado para o Blob:", blobResponse.url);

    return blobResponse.url;

  } catch (error) {
    console.error('Erro no processo de geração de PDF:', error);
    throw error;
  }
};

module.exports = { generatePdf };
