export const formatarValorMonetario = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numeroFormatado = (parseInt(apenasNumeros) / 100).toFixed(2);
    const partes = numeroFormatado.split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return partes.join(',');
}

export const formatarValorInicioMonetario = (valor) => {
    if (valor === null || valor === undefined || valor === '') {
      return '';
    }
  
    let valorNumerico;
  
    if (typeof valor === 'number') {
      valorNumerico = valor;
    } else {
      const valorStr = String(valor);
      const comPontoDecimal = valorStr.replace(',', '.');
      const valorLimpo = comPontoDecimal.replace(/\.(?=\d*\.)/g, '');
      if (valorLimpo === '' || isNaN(parseFloat(valorLimpo))) {
        return '';
      }
      valorNumerico = parseFloat(valorLimpo);
    }
    if (isNaN(valorNumerico)) {
      return '';
    }
  
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  };