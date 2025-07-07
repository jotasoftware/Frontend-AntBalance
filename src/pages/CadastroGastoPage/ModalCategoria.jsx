// ModalCategoria.jsx
import React, { useState } from 'react';
import styles from './CadastroGastoPage.module.css';
import { toast } from 'react-toastify';

import {FaShoppingCart, FaUtensils, FaFileInvoiceDollar, FaMoneyCheckAlt, FaEllipsisH, FaPaw, FaTshirt, FaHome, FaDumbbell, FaGift, FaShieldAlt, FaPiggyBank, FaChartLine, FaPlus, FaTimes} from 'react-icons/fa';
  
  const obterIconeCategoria = (nome) => {
      const entrada = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
      if (["mercado", "supermercado", "compras", "compra", "sacolao", "feira"].some(p => entrada.includes(p)))
          return <FaShoppingCart size={20} />;
      
      if (["comida", "alimentacao", "bebida", "lanche", "lanchonete", "restaurante", "pizza", "bar"].some(p => entrada.includes(p)))
          return <FaUtensils size={20} />;
      
      if (["conta", "contas", "boleto", "fatura", "energia", "agua", "internet", "telefone"].some(p => entrada.includes(p)))
          return <FaFileInvoiceDollar size={20} />;
      
      if (["imposto", "iptu", "ipva", "taxa", "licenciamento", "darf"].some(p => entrada.includes(p)))
          return <FaMoneyCheckAlt size={20} />;
      
      if (["pet", "cachorro", "gato", "racao", "veterinario", "animal", "petshop"].some(p => entrada.includes(p)))
          return <FaPaw size={20} />;
      
      if (["roupa", "vestuario", "moda", "camisa", "calca", "sapato", "tenis"].some(p => entrada.includes(p)))
          return <FaTshirt size={20} />;
      
      if (["casa", "aluguel", "moradia", "domestico", "condominio", "residencia"].some(p => entrada.includes(p)))
          return <FaHome size={20} />;
      
      if (["academia", "fitness", "musculacao", "treino", "personal", "exercicio", "crossfit", "ioga", "pilates"].some(p => entrada.includes(p)))
          return <FaDumbbell size={20} />;
      
      if (["presente", "aniversario", "casamento", "natal", "doacao", "lembranca"].some(p => entrada.includes(p)))
          return <FaGift size={20} />;
      
      if (["seguro", "seguros", "vida", "auto", "carro", "residencial", "patrimonial", "renda"].some(p => entrada.includes(p)))
          return <FaShieldAlt size={20} />;
      
      if (["investimento", "investir", "acoes", "bolsa", "previdencia", "carteira", "renda variavel"].some(p => entrada.includes(p)))
          return <FaChartLine size={20} />;
      
      if (["poupanca", "poupar", "economia", "reserva", "fundo emergencia", "cofrinho", "guardar"].some(p => entrada.includes(p)))
          return <FaPiggyBank size={20} />;
  
      return <FaEllipsisH size={20} />;
};
  

const ModalCategoria = ({ isOpen, onClose, onSelectCategoria, categorias, onAddCategoria }) => {
    const [novaCategoria, setNovaCategoria] = useState('');
    const [mostrarInputNova, setMostrarInputNova] = useState(false);


    const handleAddNovaCategoria = () => {
        if (novaCategoria.trim()) {
            const categoriaExiste = categorias.some(
                categoria => categoria.nome.toLowerCase() === novaCategoria.trim().toLowerCase()
            );

            if (categoriaExiste) {
                toast.warn('Categoria já existe!');
                return;
            }


            onAddCategoria(novaCategoria.trim());
            setNovaCategoria('');
            setMostrarInputNova(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddNovaCategoria();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Selecione uma Categoria</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={styles.categoriasGrid}>
                {categorias.map((categoria) => (
                    <button
                        key={categoria.id}
                        className={styles.categoriaItem}
                        onClick={() => {
                            onSelectCategoria(categoria.nome, categoria.id);
                            onClose(); 
                        }}
                    >
                        <span className={styles.categoriaIcon}>
                            {obterIconeCategoria(categoria.nome)}
                        </span>
                        <span className={styles.categoriaNome}>
                            {categoria.nome}
                        </span>
                    </button>
                ))}

                    {!mostrarInputNova ? (
                        <button
                            className={`${styles.categoriaItem} ${styles.addCategoriaButton}`}
                            onClick={() => setMostrarInputNova(true)}
                        >
                            <span className={styles.categoriaIcon}>
                                <FaPlus size={20} />
                            </span>
                            <span className={styles.categoriaNome}>Nova Categoria</span>
                        </button>
                    ) : (
                        <div className={styles.novaCategoriaInput}>
                            <input
                                type="text"
                                placeholder="Nome da categoria"
                                value={novaCategoria}
                                onChange={(e) => setNovaCategoria(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <button 
                                className={styles.confirmButton}
                                onClick={handleAddNovaCategoria}
                            >
                                ✓
                            </button>
                            <button 
                                className={styles.cancelButton}
                                onClick={() => {
                                    setMostrarInputNova(false);
                                    setNovaCategoria('');
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalCategoria;