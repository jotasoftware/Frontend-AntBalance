import React, { useState, useMemo } from 'react';
import styles from './Valores.module.css';

const Valores = ({ mes, valor, dadosMensais, bgColor, mesColor, valorColor }) => {
  const isExpandable = !!dadosMensais;
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  }

  const displayValue = useMemo(() => {
    if (isExpandable) {
      return dadosMensais.reduce((soma, item) => soma + item.valor, 0);
    }
    return valor || 0;
  }, [valor, dadosMensais, isExpandable])

  const formatado = displayValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const [inteiro, centavos] = formatado.split(',');
  
  const containerStyle = {
    backgroundColor: bgColor,
    color: mesColor,
  }

  return (
    <div
      className={styles.valoresContainer}
      onClick={handleToggleExpansion}
      style={{
        ...containerStyle,
        cursor: isExpandable ? 'pointer' : 'default'
      }}
    >
      <h5>{mes}</h5>
      <p style={{ color: valorColor }}>
        <span className={styles.sifraoSpan}>R$</span>
        <span className={styles.inteiroSpan}>{inteiro}</span>
        <span className={styles.centsSpan}>,{centavos}</span>
      </p>

      {isExpandable && (
        <div className={`${styles.expandableSection} ${isExpanded ? styles.expanded : ''}`}>
          {dadosMensais.map((item) => (
            <div key={item.mes} className={styles.detalheMensal}>
              <span>{item.mes}:</span>
              <strong>
                {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Valores;