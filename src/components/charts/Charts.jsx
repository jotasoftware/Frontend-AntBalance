import React, { useState, useMemo } from 'react';
import styles from './Charts.module.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';

const Charts = ({gastos, valores}) => {
  console.log(valores)

  const coresPaleta = [
    '#1a45b8', // Azul principal
    '#3b82f6', // Azul médio
    '#8b5cf6', // Violeta
    '#ec4899', // Rosa
    '#f59e0b', // Laranja
    '#10b981', // Verde
    '#06b6d4', // Ciano
    '#6366f1', // Índigo
    '#f43f5e', // Vermelho rosa
    '#84cc16', // Lima
  ];
  
  const dadosPorCategoria = useMemo(() => {
    const retorno = {};

    gastos.forEach((gasto) => {
      const categoriaNome = gasto.categoria?.nome || 'Sem Categoria';
      retorno[categoriaNome] = (retorno[categoriaNome] || 0) + gasto.valorTotal;
    });

    return {
      labels: Object.keys(retorno),
      dados: Object.values(retorno),
    };

  }, [gastos]);

  const dadosPorData = useMemo(() => {
    const retorno = {};
    console.log(valores)
    valores.forEach((valor) => {
      console.log(valor)
      const mesAno = valor.mes;
      console.log(mesAno)
      retorno[mesAno] = (retorno[mesAno] || 0) + valor.valor;
    });

    const ordenarMeses = Object.keys(retorno).sort((a, b) => {
      const toDate = (string) => {
        const [mes, ano] = string.split(' - ');
        console.log(mes)
        return new Date(`${mes} 1, ${ano}`);
      };
      return toDate(a) - toDate(b);

    });

    return {
      labels: ordenarMeses,
      dados: ordenarMeses.map((mes) => retorno[mes]),
    };
  }, [gastos]);

   const dadosPorFonte = useMemo(() => {
    const retorno = {};

    gastos.forEach((gasto) => {
      const fonte = gasto.fonte || 'Sem Fonte';
      retorno[fonte] = (retorno[fonte] || 0) + gasto.valorTotal;
    });

    return {
      labels: Object.keys(retorno),
      dados: Object.values(retorno),
    };

  }, [gastos]);


  return (
   <div className={styles.graficosContainer}>
      <div className={styles.graficoCard}>
        <h3 className={styles.graficoTitulo}>Gastos por Categoria</h3>
    <div className={styles.graficoInput} >
      <Doughnut
        data={{
          labels: dadosPorCategoria.labels,
          datasets: [
            {
              label: "Gastos na Categoria",
              data: dadosPorCategoria.dados,
              backgroundColor: coresPaleta,
              borderColor: '#ffffff',
              borderWidth: 5,
              borderRadius: 10,
              hoverOffset: 10,

            },

          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 14,
                },
                color: '#000000',
              },
            },
            tooltip: {
                backgroundColor: '#000000',
                padding: 12,
                cornerRadius: 10,
                titleFont: {
                  size: 14,
                  weight: 'bold',
                },
                bodyFont: {
                  size: 13,
                },
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
                    },
                },
            },
          },
          cutout: '50%',
          }}
      />
      </div>
    </div>
    <div className={styles.graficosContainer}>
    <div className={styles.graficoCard}>
          <h3 className={styles.graficoTitulo}>Gastos por Mês</h3>
    <div className={styles.graficoInput}>
      <Bar
          data={{
            labels: dadosPorData.labels,
            datasets: [
              {
                label: "Gastos por Mês",
                data: dadosPorData.dados,
                backgroundColor: '#1a45b8',
                borderColor: '#ffffff',
                borderWidth: 0,
                borderRadius: 6,
                hoverBackgroundColor: '#191919',
              },
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#000000',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  return `Total: R$ ${context.parsed.y}`;
                  },
              },
            },
          },
          
          }}
        />
        </div>
      </div>

        <div className={styles.graficoCard}>
          <h3 className={styles.graficoTitulo}>Gastos por Fonte</h3>
    <div className={styles.graficoInput}>
      <Radar
          data={{
            labels: dadosPorFonte.labels,
            datasets: [
              {
                label: "Gasto por Fonte",
                data: dadosPorFonte.dados,
                backgroundColor: coresPaleta,
                borderColor: '#1a45b8',
                borderWidth: 2,
                pointBackgroundColor: '#1a45b8',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#191919',
                pointHoverBorderColor: '#1a45b8',
              },
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#000000',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  return `R$ ${context.parsed.r}`;
                  },
              },
            },
          },
          
          }}
        />
        </div>

        </div>
    </div>
      
  </div>
  );
};


export default Charts;