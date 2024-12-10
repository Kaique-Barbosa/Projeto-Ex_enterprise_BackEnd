const pdf = require("html-pdf");
const ejs = require("ejs");
const axios = require("axios");
const { Blob } = require("@vercel/blob");

const generatePdf = async (dadosLocador) => {
  try {
    // URL do modelo de contrato no Vercel Blob
    const templateUrl = "https://qsgsksirv7fkvuvt.public.blob.vercel-storage.com/modeloContrato/modeloContrato.ejs";

    // Baixa o modelo de contrato
    const response = await axios.get(templateUrl);
    const templateContent = response.data;

    // Renderiza o HTML usando os dados fornecidos
    const html = ejs.render(templateContent, dadosLocador);

    const config = {
      format: "A4",
      orientation: "portrait",
      border: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "2cm",
      },
    };

    // Gera o PDF em memória
    return new Promise((resolve, reject) => {
      pdf.create(html, config).toBuffer(async (err, buffer) => {
        if (err) {
          console.error("Erro ao criar PDF:", err);
          return reject(err);
        }

        try {
          // Salva o PDF no Vercel Blob
          const blobResponse = await Blob.upload({
            data: buffer,
            contentType: "application/pdf",
            name: `contratos/gerados/contratoPreenchido_${dadosLocador.nomeLocador}.pdf`,
          });
          

          // Retorna a URL do PDF salvo
          resolve(blobResponse.url);
        } catch (uploadError) {
          console.error("Erro ao enviar PDF para o Vercel Blob:", uploadError);
          reject(uploadError);
        }
      });
    });
  } catch (error) {
    console.error("Erro no processo de geração de PDF:", error);
    throw error;
  }
};

// Exporta a função para uso em outros arquivos
module.exports = { generatePdf };
