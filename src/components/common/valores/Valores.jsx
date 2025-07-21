import React, { useState, useMemo } from 'react';
import styles from './Valores.module.css';

const Valores = ({ mensagem, valor, dadosMensais, bgColor, mesColor, valorColor }) => {
  const isExpandable = !!dadosMensais;
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  }

  const displayValue = useMemo(() => {
    if (isExpandable && mensagem!="Salários" ) {
      return dadosMensais.reduce((soma, item) => soma + item.valor, 0);
    }
    if (isExpandable && mensagem=="Salários" ) {
      return dadosMensais.reduce((soma, item) => soma + item.totalSalarios, 0);
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
      <h5>{mensagem}</h5>
      <p style={{ color: valorColor }}>
        <span className={styles.sifraoSpan}>R$</span>
        <span className={styles.inteiroSpan}>{inteiro}</span>
        <span className={styles.centsSpan}>,{centavos}</span>
      </p>

      {(isExpandable && mensagem!="Salários") && (
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

      {(isExpandable && mensagem=="Salários") && (
          <div className={`${styles.expandableSection} ${isExpanded ? styles.expanded : ''}`}>
            {dadosMensais.map((item, index) => (
              <div key={index} className={styles.detalheMensal}>
                <span>{item.setorNome}:</span>
                <strong>
                  {item.totalSalarios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Valores;