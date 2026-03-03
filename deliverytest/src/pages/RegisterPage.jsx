
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    const handleSuccess = () => {
        alert("Cadastro realizado com sucesso! Verifique seu e-mail.");
        navigate('/login');
    };

    return (
        <div className={`container ${styles.page}`}>
            <RegisterForm onSuccess={handleSuccess} />

            <div className={styles.footer}>
                <span className={styles.footerText}>
                    Já tem uma conta?{' '}
                </span>
                <button
                    onClick={() => navigate('/login')}
                    className={styles.loginButton}
                >
                    Entrar
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
