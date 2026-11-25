const express = require('express');
const routes = require('./routes');
const { HttpError } = require('./utils');

const app = express();
app.use(express.json());
app.use(routes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

// Tratamento central de erros: nunca expõe detalhes internos do banco
app.use((err, req, res, next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ erro: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ erro: 'Código já cadastrado' });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ erro: 'Dados inválidos', detalhes: err.errors.map((e) => e.message) });
  }
  console.error(err); // registro só no servidor
  return res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
