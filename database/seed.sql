-- Massa de teste: 1 configuração, 6 jogadores e 20 treinos em duas semanas.
-- Rodar logo após script.sql (tabelas vazias).
USE treinos_db;

INSERT INTO configuracoes (cargaMaximaSemanal, dataVigencia, createdAt, updatedAt)
VALUES (150.00, NULL, NOW(), NOW());

INSERT INTO jogadores (id, nome, posicao, ativo, createdAt, updatedAt) VALUES
  (1, 'Rafael Souza',  'G', 1, NOW(), NOW()),
  (2, 'Lucas Andrade', 'Z', 1, NOW(), NOW()),
  (3, 'Bruno Lima',    'Z', 1, NOW(), NOW()),
  (4, 'Felipe Rocha',  'M', 1, NOW(), NOW()),
  (5, 'Diego Costa',   'M', 1, NOW(), NOW()),
  (6, 'Gabriel Alves', 'A', 1, NOW(), NOW());

-- Carga = (duracaoMin / 10) x intensidade x multiplicador (F 1,5 | T 1,2 | E 1,0)
-- Ex.: T001 = (90 / 10) x 8 x 1,5 = 108
INSERT INTO treinos (codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade, carga, createdAt, updatedAt) VALUES
  ('T001', 4, '2026-10-05 08:00:00', 'F', 90, 8, 108.00, NOW(), NOW()),
  ('T002', 4, '2026-10-07 08:00:00', 'T', 60, 6,  43.20, NOW(), NOW()),
  ('T003', 6, '2026-10-06 10:00:00', 'F', 80, 9, 108.00, NOW(), NOW()),
  ('T004', 6, '2026-10-08 10:00:00', 'E', 45, 5,  22.50, NOW(), NOW()),
  ('T005', 6, '2026-10-10 10:00:00', 'T', 50, 7,  42.00, NOW(), NOW()),
  ('T006', 1, '2026-10-05 10:00:00', 'T', 40, 4,  19.20, NOW(), NOW()),
  ('T007', 2, '2026-10-06 08:00:00', 'E', 60, 6,  36.00, NOW(), NOW()),
  ('T008', 3, '2026-10-09 08:00:00', 'F', 50, 5,  37.50, NOW(), NOW()),
  ('T009', 5, '2026-10-07 10:00:00', 'T', 70, 5,  42.00, NOW(), NOW()),
  ('T010', 2, '2026-10-10 08:00:00', 'F', 60, 7,  63.00, NOW(), NOW()),
  ('T011', 1, '2026-10-12 08:00:00', 'F', 70, 7,  73.50, NOW(), NOW()),
  ('T012', 1, '2026-10-14 08:00:00', 'T', 60, 6,  43.20, NOW(), NOW()),
  ('T013', 3, '2026-10-13 10:00:00', 'E', 90, 4,  36.00, NOW(), NOW()),
  ('T014', 3, '2026-10-15 10:00:00', 'F', 40, 8,  48.00, NOW(), NOW()),
  ('T015', 4, '2026-10-12 10:00:00', 'F', 75, 8,  90.00, NOW(), NOW()),
  ('T016', 4, '2026-10-16 10:00:00', 'T', 45, 5,  27.00, NOW(), NOW()),
  ('T017', 5, '2026-10-13 08:00:00', 'E', 50, 6,  30.00, NOW(), NOW()),
  ('T018', 6, '2026-10-14 10:00:00', 'F', 60, 7,  63.00, NOW(), NOW()),
  ('T019', 2, '2026-10-17 09:00:00', 'T', 80, 6,  57.60, NOW(), NOW()),
  ('T020', 5, '2026-10-18 08:00:00', 'F', 30, 4,  18.00, NOW(), NOW());
