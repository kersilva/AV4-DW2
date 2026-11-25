# Sistema de Treinos Esportivos: API REST

API em Node.js com Express e MySQL via Sequelize (async/await).

## Requisitos
- Node.js 18+
- MySQL 5.7+ ou 8

## Como executar
1. `npm install`
2. Copie `.env.example` para `.env` e preencha as credenciais.
3. Crie o banco e as tabelas: `mysql -u root -p < database/script.sql`
4. Insira a massa de teste: `mysql -u root -p < database/seed.sql`
5. `npm start` (API em http://localhost:3000)

Sem terminal MySQL, abra os dois arquivos em `database/` no MySQL Workbench ou no phpMyAdmin e execute um após o outro.

## Banco de dados
- `database/script.sql`: cria o banco `treinos_db` e as tabelas `jogadores`, `configuracoes` e `treinos`, com chave estrangeira. Apaga as tabelas existentes antes de recriar, então use em desenvolvimento ou para reiniciar a massa de teste.
- `database/seed.sql`: insere 1 configuração (limite 150), 6 jogadores e 20 treinos em duas semanas. Rode somente após o `script.sql`, com as tabelas vazias.
- A aplicação não cria nem altera tabelas. Os models do Sequelize apenas validam e consultam os dados.

## Testes
Abra `requests.http` com a extensão REST Client (VS Code). Os jogadores 1 a 6 vêm do seed. Os testes criam o jogador 7 (Eduardo) e o treino T021, então rode o arquivo na ordem em um banco recém-populado.

## Regras de negócio
- Carga = (duração em minutos / 10) × intensidade × multiplicador. Multiplicadores: F = 1,5; T = 1,2; E = 1,0. Exemplo: 60 min, intensidade 8, físico → 72.
- Risco de sobrecarga: carga semanal estritamente maior que o limite. No empate não há sinalização.
- Semana: de segunda a domingo, com fuso de Brasília (-03:00).
- Rankings consideram só jogadores com ao menos um treino na semana.
- Jogador inativo não recebe novos treinos (409). O histórico é preservado.

## Status HTTP
200 consulta/atualização, 201 criação, 400 dados inválidos, 404 não encontrado, 409 código duplicado ou jogador inativo, 500 erro interno (sem detalhes expostos).

## Onde está o Sequelize e o async/await
- `src/models/`: definições, validações e associações `hasMany` / `belongsTo`.
- `src/services/`: `findAll`, `findByPk`, `findOne`, `update`, `destroy`, `count`, `Op.between`, `fn`/`col` com `group` no relatório semanal e `include`.
- `src/controllers/`: `try/catch` e respostas JSON. Erros são tratados em `src/app.js`.
