const { Op } = require('sequelize');
const { Jogador, Treino } = require('../models');
const { HttpError, validarData, inicioDoDia, fimDoDia } = require('../utils');
const { buscarPorId } = require('./jogadorService');

// Físico (F), Técnico (T), Estratégico (E)
const MULTIPLICADOR = { F: 1.5, T: 1.2, E: 1.0 };

function calcularCarga(duracaoMin, intensidade, tipo) {
  const carga = (duracaoMin / 10) * intensidade * MULTIPLICADOR[tipo];
  return Math.round(carga * 100) / 100;
}

async function registrar(dados) {
  const { codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade } = dados;
  const treino = Treino.build({ codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade, carga: 0 });
  await treino.validate(); // intensidade, duração, tipo e datas: gera 400 se inválidos

  const jogador = await Jogador.findByPk(treino.jogadorId);
  if (!jogador) throw new HttpError(404, 'Jogador não encontrado');
  if (!jogador.ativo) throw new HttpError(409, 'Jogador inativo não pode receber treinos');

  treino.carga = calcularCarga(treino.duracaoMin, treino.intensidade, treino.tipo);
  return treino.save(); // código duplicado é barrado pelo UNIQUE do banco (409)
}

function listar({ jogadorId, tipo, dataInicio, dataFim }) {
  const where = {};
  if (jogadorId) where.jogadorId = jogadorId;
  if (tipo) where.tipo = tipo;
  if (dataInicio && dataFim) {
    where.dataTreino = {
      [Op.between]: [inicioDoDia(validarData(dataInicio)), fimDoDia(validarData(dataFim))],
    };
  }
  return Treino.findAll({
    where,
    include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome', 'posicao', 'ativo'] }],
    order: [['dataTreino', 'ASC']],
  });
}

async function doJogador(id) {
  const jogador = await buscarPorId(id);
  return Treino.findAll({ where: { jogadorId: jogador.id }, order: [['dataTreino', 'ASC']] });
}

async function excluir(codigo) {
  const treino = await Treino.findOne({ where: { codigo } });
  if (!treino) throw new HttpError(404, 'Treino não encontrado');
  return treino.destroy();
}

module.exports = { calcularCarga, registrar, listar, doJogador, excluir };
