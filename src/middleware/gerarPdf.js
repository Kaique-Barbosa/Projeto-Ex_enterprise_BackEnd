const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");

const generatePdf = (dadosLocador) => {
  return new Promise((resolve, reject) => {
    const templatePath = path.resolve(
      __dirname,
      "../../public/contratos/modeloContrato.ejs"
    );

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

    // Renderiza o template EJS
    ejs.renderFile(templatePath, dadosLocador, (err, html) => {
      if (err) {
        console.error("Erro ao editar HTML:", err);
        return reject(err); // Rejeita a Promise em caso de erro
      }

      const outputFilePath = path.resolve(
        __dirname,
        `../../src/assets/contratosGerados/contratoPreenchido_${dadosLocador.nomeLocador}.pdf`
      );

      // Cria o PDF a partir do HTML renderizado
      pdf.create(html, config).toFile(outputFilePath, (err, res) => {
        if (err) {
          console.error("Erro ao criar PDF:", err);
          return reject(err); // Rejeita a Promise em caso de erro
        }

        console.log("PDF gerado com sucesso:", res);
        resolve(outputFilePath); // Resolve a Promise com o caminho do arquivo
      });
    });
  });
};

// Exporta a função para uso em outros arquivos
module.exports = { generatePdf };


// guia de uso:
// const { generatePdf } = require("./caminho/para/o/arquivo");

// const dadosLocador = {
//     nomeLocador: "Kaique",
//     estadoCivilLocador: "Solteiro",
//     profissaoLocador: "Desenvolvedor",
//     rgLocador: "123456789",
//     cpfLocador: "123.456.789-00",
//     locadouroLocador: "Rua Exemplo",
//     logradouroNumeroLocador: "123",
//     bairroLocador: "Centro",
//     cidadeLocador: "Cidade Exemplo",
//     cepLocador: "12345-678",
//   };
  
//   generatePdf(dadosLocador)
//     .then((filePath) => {
//       console.log("PDF criado em:", filePath);
//     })
//     .catch((err) => {
//       console.error("Erro ao gerar PDF:", err);
//     });
  