import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (isLogin, email, password) => {
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                navigate('/'); // Redirect to home on success
            } else {
                const { user } = await signup(email, password);
                if (user) {
                    // If email confirmation is disabled in Supabase, this logs in immediately.
                    // Otherwise user needs to confirm email.
                    alert('Verifique seu e-mail para confirmação se necessário!');
                    if (user.identities?.length === 0) {
                        setError("Usuário já registrado. Por favor faça login.");
                    } else {
                        // Success signup, maybe switch to login or auto-login
                    }
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container ${styles.page}`}>
            <AuthForm
                onSubmit={handleAuth}
                error={error}
                loading={loading}
            />
        </div>
    );
};

export default LoginPage;
