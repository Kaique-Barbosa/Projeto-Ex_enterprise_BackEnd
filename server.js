// server.js
const app = require('./src/app');
const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Sevidor rodando na porta: ${PORT}`);
});
