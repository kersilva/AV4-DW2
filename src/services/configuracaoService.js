const { Configuracao } = require('../models');
const { HttpError } = require('../utils');

const ultima = () => Configuracao.findOne({ order: [['id', 'DESC']] });

async function consultar() {
  const config = await ultima();
  if (!config) throw new HttpError(404, 'Configuração não cadastrada');
  return config;
}

// Cria na primeira vez; depois atualiza o registro existente
async function salvar({ cargaMaximaSemanal, dataVigencia }) {
  const campos = { cargaMaximaSemanal, dataVigencia: dataVigencia ?? null };
  const config = await ultima();
  if (!config) return { config: await Configuracao.create(campos), criado: true };
  return { config: await config.update(campos), criado: false };
}

module.exports = { consultar, salvar };
