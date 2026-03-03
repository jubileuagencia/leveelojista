import React from 'react';
import styles from './CartItem.module.css';
import { useTierPrice } from '../../hooks/useTierPrice';

const CartItemPrice = ({ price }) => {
    const { finalPrice, discountApplied, originalPrice } = useTierPrice(price);

    return (
        <div className={styles.priceColumn}>
            {discountApplied && (
                <span className={styles.oldPrice}>
                    R$ {originalPrice.toFixed(2).replace('.', ',')}
                </span>
            )}
            <span className={styles.price}>
                R$ {finalPrice.toFixed(2).replace('.', ',')}
            </span>
        </div>
    );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item">
            <div className={styles.imagePlaceholder}>
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                ) : (
                    <span className={styles.placeholderEmoji}>🥗</span>
                )}
            </div>

            <div className={styles.info}>
                <h3 className={styles.title}>{item.name}</h3>
                <CartItemPrice price={item.price} />
                {item.description && <p className={styles.desc}>{item.description}</p>}
            </div>

            <div className={styles.controls}>
                <div className={styles.quantityWrapper}>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >-</button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                </div>

                <button
                    onClick={() => onRemove(item.id)}
                    className={styles.removeBtn}
                    aria-label="Remover item"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default CartItem;
