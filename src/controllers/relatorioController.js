const service = require('../services/relatorioService');

exports.semanal = async (req, res, next) => {
  try {
    res.json(await service.gerarRelatorioSemanal(req.query.data));
  } catch (err) {
    next(err);
  }
};
