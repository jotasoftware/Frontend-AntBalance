import React from 'react'
import styles from "./GridCard.module.css"

const GridCard = ({children, flex = 1}) => {
  return (
    <div className={`${styles.cardContainer}`} style={{ flex }}>
        { children }
    </div>
  )
}

export default GridCard