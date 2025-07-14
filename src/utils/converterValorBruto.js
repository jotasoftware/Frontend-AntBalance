export const converterValorBruto = (valorNumerico) => {
    const centavos = Math.round(valorNumerico * 100);
    return centavos.toString();
};