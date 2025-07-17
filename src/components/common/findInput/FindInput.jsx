import React from 'react'
import styles from './FindInput.module.css'
import { IoSearch } from "react-icons/io5";

const FindInput = ({find, onChangeFind}) => {
  return (
    <div className={styles.inputContainer}>
        <input
            type="text"
            placeholder='Pesquise aqui'
            value={find}
            onChange={onChangeFind}
        />
        <IoSearch className={styles.searchIcon} ></IoSearch>
    </div>
  )
}

export default FindInput