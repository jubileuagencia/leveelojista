import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import styles from './ProductPage.module.css';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuth();

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        toggleFavorite(product.id, product);
    };

    const cartItem = cartItems?.find(item => item.id === product?.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProduct();
        }
    }, [id]);

    const handleIncrement = () => {
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else {
            removeFromCart(product.id);
        }
    };

    if (loading) return <div className={styles.loadingState}>Carregando produto...</div>;
    if (!product) return <div className={styles.emptyState}>Produto não encontrado.</div>;

    return (
        <div className={`container ${styles.page}`}>
            {/* Header / Back Button */}
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backLink}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                    Voltar
                </button>
            </div>

            {/* Product Image */}
            <div className={styles.imageContainer}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>🥦</div>
                )}
                <button className={styles.favoriteButton} onClick={handleToggleFavorite}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite(product.id) ? "var(--danger-color, #EF4444)" : "none"} stroke={isFavorite(product.id) ? "var(--danger-color, #EF4444)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            {/* Product Details */}
            <div className={styles.details}>
                <h1 className={styles.title}>{product.name}</h1>

                <div className={styles.priceRow}>
                    <span className={styles.price}>R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    <span className={styles.unit}>/ unidade</span>
                </div>

                {/* Description Section */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Descrição</h3>
                    <p className={styles.description}>
                        {product.description || "Sem descrição disponível."}
                    </p>
                </div>

                {/* Additional Info (Category) */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Categoria</h3>
                    <span className={styles.badge}>
                        {product.categories?.name || "Geral"}
                    </span>
                </div>
            </div>

            {/* Action Bar (Fixed Bottom) */}
            <div className={styles.actionBar}>
                {quantity === 0 ? (
                    <button
                        className={styles.addButton}
                        onClick={() => addToCart(product)}
                    >
                        Adicionar à Sacola - R$ {product.price.toFixed(2).replace('.', ',')}
                    </button>
                ) : (
                    <div className={styles.quantityControl}>
                        <button className={styles.qtyButton} onClick={handleDecrement}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span className={styles.qtyValue}>{quantity}</span>
                        <button className={styles.qtyButton} onClick={handleIncrement}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Spacer for fixed bottom bar */}
            <div className={styles.spacer}></div>
        </div>
    );
};

export default ProductPage;
