import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import styles from './CartPage.module.css';

import { getAppConfig } from '../services/config';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    // Totals State
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        total: 0,
        loading: true
    });

    // Calculate totals based on tier
    useEffect(() => {
        const calculateTotals = async () => {
            // 1. Calculate Base Subtotal
            const baseSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

            // 2. Fetch Config & User Tier
            // Optimization: Ideally this comes from context, but repeating logic for safety here
            const { data: { user } } = await supabase.auth.getUser();
            let tier = 'bronze';

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('tier')
                    .eq('id', user.id)
                    .single();
                if (profile) tier = profile.tier;
            }

            const config = await getAppConfig('tier_discounts');
            const discountPercent = (config && config[tier]) || 0;

            // 3. Apply Discount
            const discountAmount = baseSubtotal * discountPercent;
            const finalTotal = baseSubtotal - discountAmount;

            setTotals({
                subtotal: baseSubtotal,
                discount: discountAmount,
                total: finalTotal,
                tier: tier,
                loading: false
            });
        };

        calculateTotals();
    }, [cartItems]);

    const handleCheckout = () => {
        // Integrate with payment gateway or order service here
        navigate('/checkout');
    };

    return (
        <div className={`container ${styles.page}`}>
            <h2 className={styles.title}>Seu Carrinho</h2>

            {cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>Seu carrinho está vazio.</p>
                    <Link to="/" className={styles.emptyButton}>
                        Ver Produtos Frescos
                    </Link>
                </div>
            ) : (
                <div className="cart-grid">
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    <CartSummary totals={totals} onCheckout={handleCheckout} />
                </div>
            )}
        </div>
    );
};

export default CartPage;
