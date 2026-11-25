const { Op, fn, col } = require('sequelize');
const { Jogador, Treino } = require('../models');
const { limitesSemana } = require('../utils');
const { consultar } = require('./configuracaoService');

const TIPOS = ['F', 'T', 'E'];
const POSICOES = ['G', 'Z', 'M', 'A'];
const arredonda = (v) => Math.round(Number(v) * 100) / 100;

// Garante todos os grupos na resposta, mesmo os que não tiveram treinos
const preencherGrupos = (linhas, chave, valores) =>
  valores.map((valor) => {
    const linha = linhas.find((l) => l[chave] === valor);
    return {
      [chave]: valor,
      quantidade: linha ? Number(linha.quantidade) : 0,
      mediaCarga: linha ? arredonda(linha.mediaCarga) : null,
    };
  });

const resumoExtremo = (jogadores, carga) => ({
  cargaSemanal: carga,
  empate: jogadores.length > 1,
  jogadores: jogadores.map(({ nome, posicao, numeroTreinos }) => ({ nome, posicao, numeroTreinos })),
});

async function gerarRelatorioSemanal(data) {
  const { segunda, domingo, inicio, fim } = limitesSemana(data);
  const limite = Number((await consultar()).cargaMaximaSemanal);
  const where = { dataTreino: { [Op.gte]: inicio, [Op.lt]: fim } };

  const totalTreinos = await Treino.count({ where });

  // SUM e COUNT agrupados por jogador; include traz nome e posição
  const linhasJogador = await Treino.findAll({
    attributes: [
      'jogadorId',
      [fn('SUM', col('Treino.carga')), 'cargaTotal'],
      [fn('COUNT', col('Treino.id')), 'numeroTreinos'],
    ],
    include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome', 'posicao'] }],
    where,
    group: ['Treino.jogadorId', 'jogador.id'],
    raw: true,
    nest: true,
  });

  const porJogador = linhasJogador
    .map((l) => {
      const cargaSemanal = arredonda(l.cargaTotal);
      return {
        nome: l.jogador.nome,
        posicao: l.jogador.posicao,
        cargaSemanal,
        numeroTreinos: Number(l.numeroTreinos),
        alerta: cargaSemanal > limite ? 'RISCO DE SOBRECARGA' : null, // estritamente maior
      };
    })
    .sort((a, b) => b.cargaSemanal - a.cargaSemanal);

  let maiorCarga = null;
  let menorCarga = null;
  if (porJogador.length) {
    const maior = porJogador[0].cargaSemanal;
    const menor = porJogador[porJogador.length - 1].cargaSemanal;
    maiorCarga = resumoExtremo(porJogador.filter((j) => j.cargaSemanal === maior), maior);
    menorCarga = resumoExtremo(porJogador.filter((j) => j.cargaSemanal === menor), menor);
  }

  const linhasTipo = await Treino.findAll({
    attributes: [
      'tipo',
      [fn('AVG', col('Treino.carga')), 'mediaCarga'],
      [fn('COUNT', col('Treino.id')), 'quantidade'],
    ],
    where,
    group: ['tipo'],
    raw: true,
  });

  // Join com jogadores para agrupar por posição
  const linhasPosicao = await Treino.findAll({
    attributes: [
      [col('jogador.posicao'), 'posicao'],
      [fn('COUNT', col('Treino.id')), 'quantidade'],
      [fn('AVG', col('Treino.carga')), 'mediaCarga'],
    ],
    include: [{ model: Jogador, as: 'jogador', attributes: [] }],
    where,
    group: ['jogador.posicao'],
    raw: true,
  });

  return {
    semana: { segunda, domingo },
    criterio:
      'Rankings consideram só jogadores com pelo menos um treino na semana. Semana sem treinos retorna totais zerados e rankings nulos.',
    limiteCargaSemanal: limite,
    totalTreinos,
    porJogador,
    maiorCarga,
    menorCarga,
    jogadoresEmRisco: porJogador.filter((j) => j.alerta).length,
    mediaPorTipo: preencherGrupos(linhasTipo, 'tipo', TIPOS),
    porPosicao: preencherGrupos(linhasPosicao, 'posicao', POSICOES),
  };
}

module.exports = { gerarRelatorioSemanal };
