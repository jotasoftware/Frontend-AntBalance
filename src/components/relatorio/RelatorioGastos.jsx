import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import Botao from '../botao/Botao';
import { IoPrintOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import styles from './RelatorioGastos.module.css';

const RelatorioGastos = () => {
  const { token } = useAuth();
  const { gerarRelatorioPdf } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGerarRelatorio = async () => {
    try {
      setLoading(true);
        const payload = {
        dataInicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Primeiro dia do ano
        dataFim: new Date().toISOString().split('T')[0], // Hoje
        tipoRelatorio: 'COMPLETO'
      };

      const pdfBlob = await gerarRelatorioPdf(payload, token);

      if (!pdfBlob) {
        throw new Error('Não foi possível gerar o relatório');
      }

      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      
      const dataAtual = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `relatorio_gastos_completo_${dataAtual}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      toast.success('Relatório gerado com sucesso!');
      setShowModal(false);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório PDF. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Botao 
        icon={<IoPrintOutline size={24} color={"white"} />} 
        name={children || "Relatório"}
        onClick={handleOpenModal}
        disabled={loading}
      />

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Gerar Relatório de Gastos</h3>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.infoBox}>
                <p>
                  O relatório incluirá todos os seus gastos do ano atual, 
                  organizados por categoria e com resumo detalhado.
                </p>
                <ul className={styles.featuresList}>
                  <li>✓ Lista completa de gastos</li>
                  <li>✓ Resumo por categoria</li>
                  <li>✓ Total geral e parciais</li>
                  <li>✓ Gráficos e estatísticas</li>
                </ul>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.buttonCancel}
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className={styles.buttonSubmit}
                onClick={handleGerarRelatorio}
                disabled={loading}
              >
                {loading ? 'Gerando...' : 'Gerar PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RelatorioGastos;