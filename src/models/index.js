const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogador = sequelize.define('Jogador', {
  nome: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  posicao: {
    type: DataTypes.ENUM('G', 'Z', 'M', 'A'),
    allowNull: false,
    validate: { isIn: [['G', 'Z', 'M', 'A']] },
  },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'jogadores' });

const Treino = sequelize.define('Treino', {
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: true } },
  jogadorId: { type: DataTypes.INTEGER, allowNull: false },
  dataTreino: { type: DataTypes.DATE, allowNull: false },
  tipo: {
    type: DataTypes.ENUM('F', 'T', 'E'),
    allowNull: false,
    validate: { isIn: [['F', 'T', 'E']] },
  },
  duracaoMin: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  intensidade: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 10 } },
  carga: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'treinos' });

const Configuracao = sequelize.define('Configuracao', {
  cargaMaximaSemanal: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  dataVigencia: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'configuracoes' });

Jogador.hasMany(Treino, { foreignKey: 'jogadorId', as: 'treinos' });
Treino.belongsTo(Jogador, { foreignKey: 'jogadorId', as: 'jogador' });

module.exports = { sequelize, Jogador, Treino, Configuracao };
