import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';
import Menu from '../../components/menu/Menu';

function MainLayout() {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebarContainer}>
                <div className={styles.logoContainer}>
                    <img src="logo.svg" alt="" />
                </div>
                <div className={styles.menuContainer}>
                    <Menu></Menu>
                </div>
            </div>

        <div className={styles.mainContext}>
            <header className={styles.headerContainer}>
                <p>header</p>
            </header>
            <main className={styles.contentContainer}>
                <Outlet />
            </main>
        </div>
        </div>
    );
}

export default MainLayout;