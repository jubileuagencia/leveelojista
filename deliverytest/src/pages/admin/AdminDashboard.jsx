import React from 'react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Você é admin</h1>
            <p>Bem-vindo ao painel de controle do Levee Lojista.</p>
        </div>
    );
};

export default AdminDashboard;
