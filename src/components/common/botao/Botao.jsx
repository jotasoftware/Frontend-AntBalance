import React from 'react'
import styles from './Botao.module.css'

const Botao = ({icon, name, onClick}) => {
  return (
    <div className={name ? styles.botaoContainer : styles.botaoIcone} onClick={onClick}>
        {icon}
        {name && <p>{name}</p>}
    </div>
  )
}

export default Botao