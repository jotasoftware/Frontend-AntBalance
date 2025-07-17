import React from 'react';
import ExpanseSplit from '@/components/user/expanseSplit/ExpanseSplit';
import styles from './NotificationDropdown.module.css';

const NotificantionDropdown = ({expensesSplit, onActionFetch}) => {

  return (
    <div className={styles.dropdownContainer}>
      {expensesSplit.map((item, index) => (
        <div key={index} className={styles.itemDeGasto}>
          <ExpanseSplit expenseSplit={item} onAction={onActionFetch}></ExpanseSplit>
        </div>
      ))}
    </div>
  )
}

export default NotificantionDropdown;