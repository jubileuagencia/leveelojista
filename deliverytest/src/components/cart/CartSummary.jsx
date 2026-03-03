import React from 'react';
import styles from './CartSummary.module.css';

const CartSummary = ({ totals, onCheckout }) => {
    const deliveryFee = 5.00; // Fixed for now

    // Fallback if totals not yet loaded
    const subtotal = totals?.subtotal || 0;
    const discount = totals?.discount || 0;
    const totalBeforeDelivery = totals?.total || 0;
    const finalTotal = totalBeforeDelivery + deliveryFee;

    return (
        <div className="cart-summary">
            <h3 className={styles.title}>Resumo do Pedido</h3>

            <div className={styles.row}>
                <span className={styles.label}>Subtotal</span>
                <span className={styles.value}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            {discount > 0 && (
                <div className={styles.row}>
                    <span className={styles.labelDiscount}>
                        Desconto ({totals.tier === 'silver' ? 'Prata' : 'Ouro'})
                    </span>
                    <span className={styles.valueDiscount}>
                        - R$ {discount.toFixed(2).replace('.', ',')}
                    </span>
                </div>
            )}

            <div className={styles.row}>
                <span className={styles.label}>Taxa de Entrega</span>
                <span className={styles.value}>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.row}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>

            <button className={styles.checkoutBtn} onClick={onCheckout}>
                Finalizar Pedido
            </button>
        </div>
    );
};

export default CartSummary;
