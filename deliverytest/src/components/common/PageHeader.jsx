import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, backPath = '/' }) => {
    return (
        <div className={styles.header}>
            <Link to={backPath} className={styles.backLink}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                Voltar
            </Link>
            <h2 className={styles.title}>{title}</h2>
        </div>
    );
};

export default PageHeader;
