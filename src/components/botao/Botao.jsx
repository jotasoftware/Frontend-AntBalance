import React from 'react'
import styles from './Botao.module.css'

const Botao = ({icon, name, onClick}) => {
  return (
    <div className={styles.botaoContainer} onClick={onClick}>
        {icon}
        <p>{name}</p>
    </div>
  )
}

export default Botao