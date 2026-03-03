import React from 'react';
import styles from './HomeSearchBar.module.css';

const HomeSearchBar = () => {
    return (
        <div
            onClick={() => window.location.href = '/busca'}
            className={styles.searchContainer}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className={styles.text}>Buscar produtos frescos...</span>
        </div>
    );
};

export default HomeSearchBar;
