import React, { useState } from 'react';
import axios from 'axios';
import { gerarRelatorioPdf } from '../../services/expenseService';  


const RelatorioGastos = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('DETALHADO');
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      const pdfBlob = await gerarRelatorioPdf({dataInicio, dataFim, tipoRelatorio}, token);

      const url = window.URL.createObjectURL(new Blob([pdfBlob], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_gastos_${dataInicio}_${dataFim}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-6 h-6" />
        Relatório de Gastos
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="w-4 h-4 inline mr-1" />
            Data Início
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="w-4 h-4 inline mr-1" />
            Data Fim
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Relatório
          </label>
          <select
            value={tipoRelatorio}
            onChange={(e) => setTipoRelatorio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="DETALHADO">Detalhado</option>
            <option value="RESUMIDO">Resumido por Categoria</option>
          </select>
        </div>
        
        <button
          onClick={handleDownloadPdf}
          disabled={!dataInicio || !dataFim || loading}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2
            ${loading || !dataInicio || !dataFim 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {loading ? (
            <>Gerando PDF...</>
          ) : (
            <>
              <span className="w-4 h-4" />
              Baixar Relatório PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RelatorioGastos;