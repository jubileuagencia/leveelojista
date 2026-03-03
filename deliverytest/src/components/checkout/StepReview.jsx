import React from 'react';
import styles from './StepReview.module.css';

const StepReview = ({ address, payment, cartItems, totals, onSubmit, loading }) => {
    return (
        <div className={styles.container}>
            <h3>Tudo certo?</h3>

            <div className={styles.section}>
                <h4>📦 Produtos ({cartItems.length})</h4>
                <div className={styles.items}>
                    {cartItems.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>📍 Entrega</h4>
                <p className={styles.text}>
                    {address.street}, {address.number} - {address.district}<br />
                    {address.city} - {address.state}
                </p>
            </div>

            <div className={styles.section}>
                <h4>💳 Pagamento</h4>
                <p className={styles.text}>
                    {payment === 'pix' ? 'Pix (Aprovação Imediata)' : 'Boleto Bancário'}
                </p>
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>R$ {totals.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {totals.discount > 0 && (
                    <div className={styles.summaryRow}>
                        <span>Desconto ({totals.tier})</span>
                        <span className={styles.discount}>- R$ {totals.discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                )}
                <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Total</span>
                    <span>R$ {totals.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>

            <button
                className={styles.submitButton}
                onClick={onSubmit}
                disabled={loading}
            >
                {loading ? 'Processando...' : 'Finalizar Pedido'}
            </button>
        </div>
    );
};

export default StepReview;
