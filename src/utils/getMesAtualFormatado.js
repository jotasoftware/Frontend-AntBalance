export function getMesAtualFormatado() {
    const hoje = new Date();
    const nomeMes = hoje.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
    const ano = hoje.getFullYear();
    return `${nomeMes}/${ano}`;
  }

export function getMesAtualFormatadoValores() {
  const hoje = new Date();
  const nomeMes = hoje.toLocaleString('pt-BR', { month: 'long' });
  const ano = hoje.getFullYear();
  return `${nomeMes} - ${ano}`;
}