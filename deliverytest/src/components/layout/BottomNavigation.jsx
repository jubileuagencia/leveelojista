import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

const BottomNavigation = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => {
        if (path === '/' && currentPath === '/') return true;
        if (path !== '/' && currentPath.startsWith(path)) return true;
        return false;
    };

    return (
        <div className={styles.bottomNav}>
            <Link to="/" className={`${styles.navItem} ${isActive('/') ? styles.activeNavItem : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive('/') ? "currentColor" : "none"} stroke={isActive('/') ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Início</span>
            </Link>

            <Link to="/pedidos" className={`${styles.navItem} ${isActive('/pedidos') ? styles.activeNavItem : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive('/pedidos') ? "currentColor" : "none"} stroke={isActive('/pedidos') ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>Pedidos</span>
            </Link>

            <Link to="/favoritos" className={`${styles.navItem} ${isActive('/favoritos') ? styles.activeNavItem : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive('/favoritos') ? "currentColor" : "none"} stroke={isActive('/favoritos') ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>Favoritos</span>
            </Link>

            <Link to="#" className={styles.navItem}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                <span>Painel</span>
            </Link>
        </div>
    );
};

export default BottomNavigation;
