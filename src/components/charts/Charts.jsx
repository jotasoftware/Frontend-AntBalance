import React, { useState, useMemo } from 'react';
import styles from './Charts.module.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

const Charts = ({gastos, valores}) => {
  
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


  return (
   <div className={styles.graficosContainer} >
    <div className={styles.graficoCategorias} >
      <Doughnut
        data={{
          labels: dadosPorCategoria.labels,
          datasets: [
            {
              label: "Gastos na Categoria",
              data: dadosPorCategoria.dados,
            },

          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
    <div className={styles.graficoMeses}>
      <Bar
          data={{
            labels: dadosPorData.labels,
            datasets: [
              {
                label: "Gastos por Mês",
                data: dadosPorData.dados,
                borderColor: '#1a45b8',
              },
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
    </div>
      
  </div>
  );
};


export default Charts;