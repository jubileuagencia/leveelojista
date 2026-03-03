import React, { useState } from 'react';
import styles from './StepPayment.module.css';

const StepPayment = ({ onNext }) => {
    const [method, setMethod] = useState('pix');

    return (
        <div className={styles.container}>
            <h3>Como você prefere pagar?</h3>

            <div className={styles.options}>
                <div
                    className={`${styles.option} ${method === 'pix' ? styles.selected : ''}`}
                    onClick={() => setMethod('pix')}
                >
                    <div className={styles.icon}>💠</div>
                    <div className={styles.info}>
                        <span className={styles.name}>PIX</span>
                        <span className={styles.desc}>Aprovação imediata</span>
                    </div>
                </div>

                <div
                    className={`${styles.option} ${method === 'boleto' ? styles.selected : ''}`}
                    onClick={() => setMethod('boleto')}
                >
                    <div className={styles.icon}>📄</div>
                    <div className={styles.info}>
                        <span className={styles.name}>Boleto Bancário</span>
                        <span className={styles.desc}>Vencimento em 3 dias</span>
                    </div>
                </div>
            </div>

            <button className={styles.nextButton} onClick={() => onNext(method)}>
                Revisar Pedido
            </button>
        </div>
    );
};

export default StepPayment;
