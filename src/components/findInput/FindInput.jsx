import React from 'react'
import styles from './FindInput.module.css'

const FindInput = ({icon, name, onClick}) => {
  return (
    <div className={styles.inputContainer} onClick={onClick}>
        <input type="text" />
    </div>
  )
}

export default FindInput