import React, { useState, useMemo } from 'react';
import styles from './Charts.module.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2';

const Charts = () => {

  return (
   <div className='Gráficos' >
    
    <div className='ChartCategorias' >
      <Doughnut
        data={{
          labels: ["Mercado", "Bet", "Fatura"],
          datasets: [
            {
              label: "Gastos por Categoria",
              data: [300, 70, 900],
            },

          ],
        }}
      />
    </div>  
    <div className='ChartMeses'>
      <Line
        data={{
          labels: ["Julho, Agosto, Setembro"],
          datasets: [
            {
              label: "Gastos por Mês",
              data: [2500, 1900, 3250],
            },
          ]
        }}
      />

    </div>
  
  </div>
  );
};

export default Charts;