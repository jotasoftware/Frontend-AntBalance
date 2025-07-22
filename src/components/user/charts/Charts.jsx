import React, { useState, useMemo } from 'react';
import styles from './Charts.module.css';
import { Chart as ChartJS, Colors } from 'chart.js/auto';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';
import { TbChartDonutFilled, TbCategory } from "react-icons/tb";
import { IoBarChart } from "react-icons/io5";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { useOutletContext } from 'react-router-dom';
import { getMesAtualFormatado } from '@/utils/getMesAtualFormatado';

const Charts = ({gastos, valores, gastosMes}) => {

  const [selected, setSelected] = useState(0);
  const [view, setView] = useState('atual');
  const { isMobile } = useOutletContext();

  const handleSetView = (event) => {
    setView(event.target.value);
  };

  const types = [
    "Gastos por categorias",
    "Gastos por mês",
    "Gastos por fonte",
    "Gastos por limite"
  ]

  const itemWidth = 30;
  const gap = 5;
  const left = selected * (itemWidth + gap);

  const coresPaleta = [
    '#1a45b8', // Azul principal
    '#6366f1', // Índigo
    '#ec4899', // Rosa
    '#8b5cf6', // Violeta
    '#f59e0b', // Laranja
    '#10b981', // Verde
    '#06b6d4', // Ciano
    '#3b82f6', // Azul médio
    '#f43f5e', // Vermelho rosa
    '#84cc16',
  ];

  const dadosPorCategoria = useMemo(() => {
  const retorno = {};

   if (view === "atual") {
    const mesAtual = getMesAtualFormatado();
    const gastosDoMes = gastosMes.find(mes => mes.mes === mesAtual)?.gastos || [];
    
    gastosDoMes.forEach((gasto) => {
      const categoriaNome = gasto.categoria || 'Sem Categoria';
      retorno[categoriaNome] = (retorno[categoriaNome] || 0) + gasto.valor;
    });
  } 

  else if (view === "todos") {
    gastos.forEach((gasto) => {
      const categoriaNome = gasto.categoria?.nome || 'Sem Categoria';
      retorno[categoriaNome] = (retorno[categoriaNome] || 0) + gasto.valorTotal;
    });
  }

    return {
      labels: Object.keys(retorno),
      dados: Object.values(retorno),
    };

  }, [gastos, gastosMes, view]);

  const dadosPorLimiteCategoria = useMemo(() => { //novos retornos para manipular cada tipo de dados
    const retorno = {
      labels: [],
      limites: [],
      gastos: [],
      porcentagens: []
    };

    
    const limitesMap = {};
    gastos.forEach((gasto) => {
      if (gasto.categoria?.nome && gasto.categoria?.limiteDeGasto) {
        limitesMap[gasto.categoria.nome] = gasto.categoria.limiteDeGasto;
      }
    });

    
      dadosPorCategoria.labels.forEach((categoria, index) => {
        const gasto = dadosPorCategoria.dados[index];
        const limite = limitesMap[categoria] || 0;
      
        if (limite > 0) { 
          retorno.labels.push(categoria);
          retorno.limites.push(limite);
          retorno.gastos.push(gasto);
          retorno.porcentagens.push(Math.min((gasto / limite) * 100, 150));
        }
    });

    return retorno;
  }, [gastos, dadosPorCategoria, gastosMes, view]);

  const dadosPorData = useMemo(() => {
    const retorno = {};

    valores.forEach((valor) => {
      const mesAno = valor.mes;
      retorno[mesAno] = (retorno[mesAno] || 0) + valor.valor;
    });

    const ordenarMeses = Object.keys(retorno).sort((a, b) => {
      const toDate = (string) => {
        const [mes, ano] = string.split(' - ');
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

      if (view === "atual") {
        const mesAtual = getMesAtualFormatado();
        const gastosDoMes = gastosMes.find(mes => mes.mes === mesAtual)?.gastos || [];
        
        gastosDoMes.forEach((gasto) => {
          const fonte = gasto.fonte || 'Sem Fonte';
          retorno[fonte] = (retorno[fonte] || 0) + gasto.valor;
        });
      } 
      else if (view === "todos") {
        gastos.forEach((gasto) => {
          const fonte = gasto.fonte || 'Sem Fonte';
          retorno[fonte] = (retorno[fonte] || 0) + gasto.valorTotal;
        });
      }

    const ordenarDados = Object.entries(retorno)
    .map(([label, valor]) => ({ label, valor }))
    .sort((a, b) => b.valor - a.valor);

    return {
      labels: ordenarDados.map(item => item.label),
    dados: ordenarDados.map(item => item.valor),
    };

  }, [gastos, gastosMes, view]);


  return (
   <div className={styles.graficosContainer}>
      <div className={styles.graficoName}>
        <div className={styles.graficoTitulo}>
          <h4>{types[selected]}</h4>
          {isMobile && <div className={styles.sortContainer}>
              <select
                  id="sort"
                  value={view}
                  onChange={handleSetView}
                  className={styles.sortSelect}
              >
                  <option value="atual">Esse mês</option>
                  <option value="todos">Todos os gastos</option>
              </select>
          </div>}
        </div>
        <div className={styles.graficoEnd}>
          {!isMobile && <div className={styles.sortContainer}>
              <select
                  id="sort"
                  value={view}
                  onChange={handleSetView}
                  className={styles.sortSelect}
              >
                  <option value="atual">Esse mês</option>
                  <option value="todos">Todos os gastos</option>
              </select>
          </div>}
          <div className={styles.graficosType}>
            <div className={styles.indicator} style={{ left: `${left}px` }}></div>
            <div className={styles.typeIconDiv} onClick={() => setSelected(0)}>
              <TbChartDonutFilled style={{ color: (selected === 0) ? "white" : "black" }} className={styles.typeIcon}/>
            </div>
            <div className={styles.typeIconDiv} onClick={() => setSelected(1)}>
              <IoBarChart style={{ color: (selected === 1) ? "white" : "black" }} className={styles.typeIcon}/>
            </div>
            <div className={styles.typeIconDiv} onClick={() => setSelected(2)}>
              <PiChartBarHorizontalFill style={{ color: (selected === 2) ? "white" : "black" }} className={styles.typeIcon}/>
            </div>
            <div className={styles.typeIconDiv} onClick={() => setSelected(3)}>
            <TbCategory style={{ color: (selected === 3) ? "white" : "black" }} className={styles.typeIcon}/>
            </div>
          </div>
        </div>
      </div>

      {selected === 0 && (
  <div className={styles.graficoCard}>
    <div className={styles.graficoInput}>
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
              borderRadius: 8,
              hoverOffset: 15,
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
                  family: 'Poppins',
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
                  return ` ${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${percentage}%)`;
                },
              },
            },
          },
          cutout: '50%',
        }}
      />

    </div>
  </div>
)}

{selected === 1 && (
  <div className={styles.graficoCard}>
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
                  return ` Total: ${context.parsed.y.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                },
              },
            },
          },
        }}
      />
    </div>
  </div>
)}

{selected === 2 && (
  <div className={styles.graficoCard}>
    <div className={styles.graficoInput}>
      <Bar
        data={{
          labels: dadosPorFonte.labels,
          datasets: [
            {
              label: "Gasto por Fonte",
              data: dadosPorFonte.dados,
              backgroundColor: coresPaleta,
              borderColor: '#ffffff',
              borderWidth: 0,
              borderRadius: 6,
              hoverBackgroundColor: '#191919',
            },
          ]
        }}
        options={{
          indexAxis: 'y',
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
                  return ` Total: ${context.parsed.x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                },
              },
            },
          },
        }}
      />
    </div>
  </div>
)}

{selected === 3 && (
<div className={styles.graficoCard}>
    <div className={styles.graficoInput}>
      <Bar
        data={{
          labels: dadosPorLimiteCategoria.labels,
          datasets: [
            {
              label: "% do Limite Utilizado",
              data: dadosPorLimiteCategoria.porcentagens,
              backgroundColor: dadosPorLimiteCategoria.porcentagens.map(porcentagem => {
                if (porcentagem > 100) return '#dc2626'; 
                if (porcentagem > 80) return '#f59e0b'; 
                if (porcentagem > 60) return '#eab308';
                return '#22c55e';
              }),
              borderColor: '#ffffff',
              borderWidth: 0,
              borderRadius: 6,
            }
          ]
        }}
        options={{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                generateLabels: function() {
                  return [
                    {
                      text: 'Seguro',
                      fillStyle: '#22c55e',
                      strokeStyle: '#22c55e',
                      lineWidth: 0,
                      hidden: false,
                    },
                    {
                      text: 'Atenção',
                      fillStyle: '#eab308',
                      strokeStyle: '#eab308',
                      lineWidth: 0,
                      hidden: false,
                    },
                    {
                      text: 'Limite quase atingido',
                      fillStyle: '#f59e0b',
                      strokeStyle: '#f59e0b',
                      lineWidth: 0,
                      hidden: false,
                    },
                    {
                      text: 'Limite Excedido',
                      fillStyle: '#dc2626',
                      strokeStyle: '#dc2626',
                      lineWidth: 0,
                      hidden: false,
                    }
                  ]
                },
              usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  family: 'Poppins'
                }
              }
            },
            tooltip: {
              backgroundColor: '#000000',
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  const gasto = dadosPorLimiteCategoria.gastos[index];
                  const limite = dadosPorLimiteCategoria.limites[index];
                  const porcentagem = context.parsed.x;
                  
                  return [
                    ` Gasto: ${gasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                    ` Limite: ${limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                    ` ${porcentagem.toFixed(1)}% do limite`
                  ];
                },
              },
            },
            
            annotation: {
              annotations: {
                line1: {
                  type: 'line',
                  xMin: 100,
                  xMax: 100,
                  borderColor: '#ef4444',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  label: {
                    display: true,
                    content: 'Limite',
                    position: 'start',
                  }
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 150,
              ticks: {

                stepSize: 25,
                callback: function(value) {
                  return value + '%';
                }
              }
            },
          }
        }}
      />
    </div>
  </div>
)}

      
  </div>
  );
};


export default Charts;