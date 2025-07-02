import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';

function MainLayout() {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebarContainer}>
                <div className={styles.logoContainer}>
                    <p>logo</p>
                </div>
                <div className={styles.menuContainer}>
                    <p>menu</p>
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