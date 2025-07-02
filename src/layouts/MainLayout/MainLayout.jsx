import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';
import Menu from '../../components/menu/Menu';
import Header from '../../components/header/Header';

function MainLayout() {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebarContainer}>
                <div className={styles.logoContainer}>
                    <img src="logo.svg" alt="" />
                </div>
                <Menu></Menu>
            </div>

        <div className={styles.mainContext}>
            <Header></Header>
            <main className={styles.contentContainer}>
                <Outlet />
            </main>
        </div>
        </div>
    );
}

export default MainLayout;