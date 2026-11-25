-- Sistema de Treinos Esportivos: criação do banco e das tabelas (MySQL 5.7+ / 8)
-- ATENÇÃO: este script APAGA as tabelas existentes e seus dados antes de recriá-las.

CREATE DATABASE IF NOT EXISTS treinos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE treinos_db;

DROP TABLE IF EXISTS treinos;
DROP TABLE IF EXISTS configuracoes;
DROP TABLE IF EXISTS jogadores;

CREATE TABLE jogadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  posicao ENUM('G', 'Z', 'M', 'A') NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE configuracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cargaMaximaSemanal DECIMAL(10, 2) NOT NULL,
  dataVigencia DATETIME NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE treinos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(255) NOT NULL UNIQUE,
  jogadorId INT NOT NULL,
  dataTreino DATETIME NOT NULL,
  tipo ENUM('F', 'T', 'E') NOT NULL,
  duracaoMin INT NOT NULL,
  intensidade INT NOT NULL,
  carga DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  CONSTRAINT fk_treinos_jogador FOREIGN KEY (jogadorId) REFERENCES jogadores (id)
) ENGINE=InnoDB;
