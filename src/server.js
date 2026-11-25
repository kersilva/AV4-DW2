const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado ao MySQL');
    app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Falha ao conectar ao banco:', err.message);
    process.exit(1);
  });
