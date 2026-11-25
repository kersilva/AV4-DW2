class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;

// Datas são tratadas no fuso de Brasília (-03:00), que não tem horário de verão desde 2019
const inicioDoDia = (data) => new Date(`${data}T00:00:00-03:00`);
const fimDoDia = (data) => new Date(`${data}T23:59:59-03:00`);

function validarData(texto) {
  if (!REGEX_DATA.test(texto || '') || Number.isNaN(new Date(`${texto}T00:00:00Z`).getTime())) {
    throw new HttpError(400, 'Data inválida. Use o formato AAAA-MM-DD');
  }
  return texto;
}

// Semana de segunda a domingo; devolve o intervalo [inicio, fim) para consultas
function limitesSemana(data) {
  validarData(data);
  const d = new Date(`${data}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); // volta até a segunda
  const segunda = d.toISOString().slice(0, 10);
  d.setUTCDate(d.getUTCDate() + 6);
  const domingo = d.toISOString().slice(0, 10);
  d.setUTCDate(d.getUTCDate() + 1);
  const proximaSegunda = d.toISOString().slice(0, 10);
  return { segunda, domingo, inicio: inicioDoDia(segunda), fim: inicioDoDia(proximaSegunda) };
}

module.exports = { HttpError, validarData, inicioDoDia, fimDoDia, limitesSemana };
