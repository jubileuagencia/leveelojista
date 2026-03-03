import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';

const AuthForm = ({ onSubmit, error, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(true, email, password);
    };

    return (
        <div className={`glass-panel ${styles.formContainer}`}>
            <h2 className={styles.title}>Bem-vindo(a)</h2>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>E-mail</label>
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Senha</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Processando...' : 'Entrar'}
                </button>
            </form>

            <p className={styles.switchText}>
                Não tem uma conta?{' '}
                <Link to="/cadastro" className={styles.switchButton}>
                    Cadastrar
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;
