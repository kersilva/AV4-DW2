const express = require('express');
const jogador = require('../controllers/jogadorController');
const treino = require('../controllers/treinoController');
const configuracao = require('../controllers/configuracaoController');
const relatorio = require('../controllers/relatorioController');

const router = express.Router();

router.post('/jogadores', jogador.cadastrar);
router.get('/jogadores', jogador.listar);
router.get('/jogadores/:id', jogador.consultar);
router.put('/jogadores/:id', jogador.atualizar);
router.patch('/jogadores/:id/desativar', jogador.desativar);

router.get('/configuracao', configuracao.consultar);
router.put('/configuracao', configuracao.atualizar);

router.post('/treinos', treino.registrar);
router.get('/treinos', treino.listar);
router.get('/treinos/jogador/:id', treino.doJogador);
router.delete('/treinos/:codigo', treino.excluir);

router.get('/relatorios/semanal', relatorio.semanal);

module.exports = router;
