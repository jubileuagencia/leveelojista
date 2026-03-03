import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminRoute.module.css';

const AdminRoute = () => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

    if (!isAdmin) {
        return (
            <div className={styles.denied}>
                <h1>Acesso Negado</h1>
                <p>Esta área é restrita para administradores.</p>
                <Link to="/" className={styles.backLink}>
                    Voltar para a Loja
                </Link>
            </div>
        );
    }

    return <Outlet />;
};

export default AdminRoute;
