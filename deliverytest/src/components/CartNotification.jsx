import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './CartNotification.module.css';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

const CartNotification = ({ onClose, hasBottomNav }) => {
    const { cartItems } = useCart();
    const { profile } = useAuth();
    const { config } = useConfig();

    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const displayTotal = useMemo(() => {
        const baseSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

        const tier = profile?.tier || 'bronze';
        const discounts = config.tier_discounts || {};
        const discountPercent = discounts[tier] || 0;

        return baseSubtotal - (baseSubtotal * discountPercent);
    }, [cartItems, profile?.tier, config.tier_discounts]);

    if (itemCount === 0) return null;

    return (
        <div
            className={styles.container}
            style={{ bottom: hasBottomNav ? '80px' : '20px' }}
        >
            <div className={styles.info}>
                <span className={styles.label}>Total</span>
                <div className={styles.values}>
                    <span className={styles.price}>R$ {displayTotal.toFixed(2).replace('.', ',')}</span>
                    <span className={styles.count}> / {itemCount} itens</span>
                </div>
            </div>
            <Link to="/carrinho" className={styles.button} onClick={onClose}>
                Ver sacola
            </Link>
        </div>
    );
};

export default CartNotification;
