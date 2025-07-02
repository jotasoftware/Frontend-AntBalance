import React, { useEffect, useState } from 'react'
import styles from './Header.module.css';
import Avatar from '../avatar/Avatar';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { userName } = useAuth();
  const [greetings, setGreetings] = useState("Olá");

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
  return (
    <header className={styles.headerContainer}>
        <div className={styles.welcomeContainer}>
            <h2>{greetings}, {userName}</h2>
            <p>Olhe seus gastos</p>
        </div>
        <div className={styles.infoContainer}>
            <Avatar name={userName}></Avatar>
        </div>
    </header>
  )
}

export default Header