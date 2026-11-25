const service = require('../services/jogadorService');

exports.cadastrar = async (req, res, next) => {
  try {
    const jogador = await service.cadastrar(req.body);
    res.status(201).json(jogador);
  } catch (err) {
    next(err);
  }
};

exports.listar = async (req, res, next) => {
  try {
    res.json(await service.listar());
  } catch (err) {
    next(err);
  }
};

exports.consultar = async (req, res, next) => {
  try {
    res.json(await service.buscarPorId(req.params.id));
  } catch (err) {
    next(err);
  }
};

exports.atualizar = async (req, res, next) => {
  try {
    res.json(await service.atualizar(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

exports.desativar = async (req, res, next) => {
  try {
    res.json(await service.desativar(req.params.id));
  } catch (err) {
    next(err);
  }
};
