export const formatarValorMonetario = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numeroFormatado = (parseInt(apenasNumeros) / 100).toFixed(2);
    const partes = numeroFormatado.split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return partes.join(',');
}

export const formatarValorInicioMonetario = (valor) => {
    // 1. Tratamento de entradas nulas, indefinidas ou vazias
    if (valor === null || valor === undefined || valor === '') {
      return '';
    }
  
    let valorNumerico;
  
    if (typeof valor === 'number') {
      valorNumerico = valor;
    } else {
      // Converte para string para manipulação
      const valorStr = String(valor);
  
      // --- LÓGICA DE LIMPEZA CORRIGIDA ---
  
      // Primeiro, trocamos a vírgula (decimal do Brasil) por ponto (decimal do JavaScript)
      // Ex: '1.234,56' se torna '1.234.56'
      const comPontoDecimal = valorStr.replace(',', '.');
  
      // Agora, removemos TODOS os pontos, exceto o ÚLTIMO, que é o nosso decimal.
      // Usamos uma RegEx que localiza todos os pontos que são seguidos por outros pontos ou dígitos.
      const valorLimpo = comPontoDecimal.replace(/\.(?=\d*\.)/g, '');
  
      // Se após a limpeza não sobrar nada, retorna vazio
      if (valorLimpo === '' || isNaN(parseFloat(valorLimpo))) {
        return '';
      }
      
      valorNumerico = parseFloat(valorLimpo);
    }
  
    // 3. Validação final
    if (isNaN(valorNumerico)) {
      return '';
    }
  
    // 4. Formatação final usando a API Intl.NumberFormat
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  };