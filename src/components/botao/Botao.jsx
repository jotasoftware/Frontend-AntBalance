import React from 'react'
import styles from './Botao.module.css'

const Botao = ({icon, name}) => {
  return (
    <div className={styles.botaoContainer}>
        {icon}
        <p>{name}</p>
    </div>
  )
}

export default Botao