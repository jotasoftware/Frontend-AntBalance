import React from 'react';
import {
  FaShoppingCart, FaUtensils, FaFileInvoiceDollar, FaMoneyCheckAlt, FaEllipsisH,
  FaPaw, FaTshirt, FaHome, FaDumbbell, FaGift, FaShieldAlt, FaPiggyBank, FaChartLine
} from 'react-icons/fa';

export const obterIconeCategoria = (nome, size=20) => {
    const entrada = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (["mercado", "supermercado", "compras", "compra", "sacolao", "feira"].some(p => entrada.includes(p)))
        return <FaShoppingCart size={size} />;

    if (["comida", "alimentacao", "bebida", "lanche", "lanchonete", "restaurante", "pizza", "bar"].some(p => entrada.includes(p)))
        return <FaUtensils size={size} />;

    if (["conta", "contas", "boleto", "fatura", "energia", "agua", "internet", "telefone"].some(p => entrada.includes(p)))
        return <FaFileInvoiceDollar size={size} />;

    if (["imposto", "iptu", "ipva", "taxa", "licenciamento", "darf", "bet", "apostas"].some(p => entrada.includes(p)))
        return <FaMoneyCheckAlt size={size} />;

    if (["pet", "cachorro", "gato", "racao", "veterinario", "animal", "petshop"].some(p => entrada.includes(p)))
        return <FaPaw size={size} />;

    if (["roupa", "vestuario", "moda", "camisa", "calca", "sapato", "tenis"].some(p => entrada.includes(p)))
        return <FaTshirt size={size} />;

    if (["casa", "aluguel", "moradia", "domestico", "condominio", "residencia"].some(p => entrada.includes(p)))
        return <FaHome size={size} />;

    if (["academia", "fitness", "musculacao", "treino", "personal", "exercicio", "crossfit", "ioga", "pilates"].some(p => entrada.includes(p)))
        return <FaDumbbell size={size} />;

    if (["presente", "aniversario", "casamento", "natal", "doacao", "lembranca"].some(p => entrada.includes(p)))
        return <FaGift size={size} />;

    if (["seguro", "seguros", "vida", "auto", "carro", "residencial", "patrimonial", "renda"].some(p => entrada.includes(p)))
        return <FaShieldAlt size={size} />;

    if (["investimento", "investir", "acoes", "bolsa", "previdencia", "carteira", "renda variavel"].some(p => entrada.includes(p)))
        return <FaChartLine size={size} />;

    if (["poupanca", "poupar", "economia", "reserva", "fundo emergencia", "cofrinho", "guardar"].some(p => entrada.includes(p)))
        return <FaPiggyBank size={size} />;

    return <FaEllipsisH size={size} />;
};
