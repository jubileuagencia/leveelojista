import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesItem from '../components/favorites/FavoritesItem';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './FavoritesPage.module.css';

const FavoritesPage = () => {
    const { getFavoritesWithDetails, toggleFavorite } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const load = async () => {
            const data = await getFavoritesWithDetails();
            setProducts(data);
            setLoading(false);
        };
        load();
    }, [user, getFavoritesWithDetails]);

    const handleRemove = async (id) => {
        await toggleFavorite(id);
        // Optimistic Remove from UI
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    if (loading) {
        return <div className={styles.loading}>Carregando favoritos...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/" className={styles.backLink}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                </Link>
                <h1 className={styles.pageTitle}>Meus Favoritos</h1>
            </div>

            {products.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Você ainda não tem favoritos.</p>
                    <Link to="/" className={styles.exploreLink}>
                        Explorar produtos
                    </Link>
                </div>
            ) : (
                <div className={styles.list}>
                    {products.map(product => (
                        <FavoritesItem
                            key={product.id}
                            product={product}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
