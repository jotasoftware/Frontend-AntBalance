export const converterStringParaNumero = (valorString) => {
    if(typeof valorString !== 'string' || !valorString) {
        return 0;
    }
    const stringSemPontos = valorString.replaceAll('.', '');
    const stringFormatoNumerico = stringSemPontos.replace(',', '.');
    const numero = parseFloat(stringFormatoNumerico);
    return isNaN(numero) ? 0 : numero;
}