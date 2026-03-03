import React from 'react';
import styles from './FavoritesItem.module.css';
import { useCart } from '../../context/CartContext';
import { useTierPrice } from '../../hooks/useTierPrice';

const FavoritesItem = ({ product, onClick }) => {
    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
    const { finalPrice, discountApplied, originalPrice } = useTierPrice(product.price);

    const cartItem = cartItems.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleIncrement = (e) => {
        e.stopPropagation();
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else {
            removeFromCart(product.id);
        }
    };

    return (
        <div className={styles.card} onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className={styles.imageWrapper}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>🥦</div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.unit}>{product.unit || 'Unidade'}</p>
                    <div className={styles.priceRow}>
                        {discountApplied && (
                            <span className={styles.oldPrice}>R$ {originalPrice.toFixed(2).replace('.', ',')}</span>
                        )}
                        <span className={styles.price}>R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                {quantity === 0 ? (
                    <button
                        className={styles.btnAdd}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        aria-label="Adicionar ao carrinho"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                ) : (
                    <div className={styles.qtyControl} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.qtyBtn} onClick={handleDecrement}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span className={styles.qtyValue}>{quantity}</span>
                        <button className={styles.qtyBtn} onClick={handleIncrement}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesItem;
