const service = require('../services/treinoService');

exports.registrar = async (req, res, next) => {
  try {
    const treino = await service.registrar(req.body);
    res.status(201).json(treino);
  } catch (err) {
    next(err);
  }
};

exports.listar = async (req, res, next) => {
  try {
    res.json(await service.listar(req.query));
  } catch (err) {
    next(err);
  }
};

exports.doJogador = async (req, res, next) => {
  try {
    res.json(await service.doJogador(req.params.id));
  } catch (err) {
    next(err);
  }
};

exports.excluir = async (req, res, next) => {
  try {
    await service.excluir(req.params.codigo);
    res.json({ mensagem: 'Treino excluído com sucesso' });
  } catch (err) {
    next(err);
  }
};
