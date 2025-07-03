import React from 'react'
import styles from './Valores.module.css'

const Valores = ({mes, valor, bgColor, mesColor, valorColor}) => {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

  const formatado = numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const containerStyle = {
    backgroundColor: bgColor,
    color: mesColor,
  };

  const [inteiro, centavos] = formatado.split(',');
  return (
    <div className={styles.valoresContainer} style={containerStyle}>
        <h5>{mes}</h5>
        <p style={{ color: valorColor }}><span className={styles.sifraoSpan}>R$</span><span className={styles.inteiroSpan}>{inteiro}</span><span className={styles.centsSpan}>,{centavos}</span></p>
    </div>
  )
}

export default Valores