import React from 'react';
import ExpanseSplit from '../expanseSplit/ExpanseSplit';
import styles from './NotificationDropdown.module.css';

const NotificantionDropdown = ({expensesSplit}) => {

  return (
    <div className={styles.dropdownContainer}>
      {expensesSplit.map((item, index) => (
        <div key={index} className={styles.itemDeGasto}>
          <ExpanseSplit expenseSplit={item}></ExpanseSplit>
        </div>
      ))}
    </div>
  )
}

export default NotificantionDropdown;