import React, {useState, useEffect, useRef} from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';
import Menu from '@/components/common/menu/Menu';
import Header from '@/components/common/header/Header';

function MainLayout() {
    const isMobile = !window.matchMedia('(min-width: 769px)').matches;
    const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleResize = (e) => setSidebarOpen(!e.matches);
        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isMobile) {
                return;
            }
            if (!isSidebarOpen || !sidebarRef.current || sidebarRef.current.contains(event.target)) {
                return;
            }

            if (event.target.closest('[data-sidebar-toggle]')) {
                return;
            }
            setSidebarOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen, isMobile, sidebarRef]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className={styles.layoutContainer}>
            <div ref={sidebarRef} className={`${styles.sidebarContainer} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
                <div className={styles.logoContainer}>
                    <img src="logo.svg" alt="" />
                </div>
                <Menu></Menu>
            </div>

        <div className={styles.mainContext}>
            <Header onToggleSidebar={toggleSidebar} />
            <main className={styles.contentContainer}>
                <Outlet context={{isMobile}}/>
            </main>
        </div>
        </div>
    );
}

export default MainLayout;