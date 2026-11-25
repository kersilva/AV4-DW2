const service = require('../services/configuracaoService');

exports.consultar = async (req, res, next) => {
  try {
    res.json(await service.consultar());
  } catch (err) {
    next(err);
  }
};

exports.atualizar = async (req, res, next) => {
  try {
    const { config, criado } = await service.salvar(req.body);
    res.status(criado ? 201 : 200).json(config);
  } catch (err) {
    next(err);
  }
};
