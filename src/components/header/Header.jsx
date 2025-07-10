import React, { useEffect, useState, useRef } from 'react'
import styles from './Header.module.css';
import Avatar from '../avatar/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useSplit } from '../../context/SplitExpanseContext';
import { IoNotificationsSharp } from "react-icons/io5";
import NotificationDropdown from "../notificationDropdown/NotificantionDropdown"

const Header = () => {
  const { userName } = useAuth();
  const { splitGastos } = useSplit();
  const [greetings, setGreetings] = useState("Olá");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log(splitGastos)
  const expensesSplit = [
    { nome: "joao", valor: 300 },
    { nome: "ricardo", valor: 400 }
  ];
  

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        setGreetings("Bom dia");
    } else if (hour >= 12 && hour < 18) {
        setGreetings("Boa tarde")
    } else {
        setGreetings("Boa noite")
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef])

  return (
    <header className={styles.headerContainer}>
        <div className={styles.welcomeContainer}>
            <h2>{greetings}, {userName}</h2>
            <p>Olhe seus gastos</p>
        </div>
        <div className={styles.infoContainer}>
        <div className={styles.notificationWrapper} ref={dropdownRef}>
            <div className={styles.notificationDiv} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <IoNotificationsSharp size={24} className={styles.notificationIcon}/>
              {expensesSplit.length > 0 && <span className={styles.quantNotification}>{expensesSplit.length}</span>}
            </div>
            {isMenuOpen && <NotificationDropdown expensesSplit={expensesSplit}/>}
          </div>
          <Avatar name={userName}></Avatar>
        </div>
    </header>
  )
}

export default Header