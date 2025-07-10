export const formatarValorMonetario = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numeroFormatado = (parseInt(apenasNumeros) / 100).toFixed(2);
    const partes = numeroFormatado.split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return partes.join(',');
}