const { Jogador } = require('../models');
const { HttpError } = require('../utils');

const listar = () => Jogador.findAll({ order: [['id', 'ASC']] });

async function buscarPorId(id) {
  const jogador = await Jogador.findByPk(id);
  if (!jogador) throw new HttpError(404, 'Jogador não encontrado');
  return jogador;
}

const cadastrar = ({ nome, posicao }) => Jogador.create({ nome, posicao });

async function atualizar(id, { nome, posicao }) {
  const jogador = await buscarPorId(id);
  return jogador.update({
    ...(nome !== undefined && { nome }),
    ...(posicao !== undefined && { posicao }),
  });
}

async function desativar(id) {
  const jogador = await buscarPorId(id);
  return jogador.update({ ativo: false });
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, desativar };
