import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StepSuccess.module.css';

const StepSuccess = ({ orderId, paymentMethod }) => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>🎉</div>
            <h2>Pedido Confirmado!</h2>
            <p className={styles.message}>
                Seu pedido foi recebido e já está sendo processado.
            </p>

            {paymentMethod === 'pix' && (
                <div className={styles.paymentBox}>
                    <h4>Pagamento via Pix</h4>
                    <div className={styles.qrPlaceholder}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                            alt="QR Code Pix"
                            className={styles.qrImage}
                        />
                        <span>(Simulação)</span>
                    </div>
                    <p className={styles.instruction}>
                        Escaneie o QR Code acima para pagar. <br />
                        Aprovação automática em ambiente de teste.
                    </p>
                </div>
            )}

            {paymentMethod === 'boleto' && (
                <div className={styles.paymentBox}>
                    <h4>Boleto Gerado</h4>
                    <p>Seu boleto foi enviado por e-mail.</p>
                    <div className={styles.barcode}>
                        |||| |||| || |||||| |||| ||||
                    </div>
                </div>
            )}

            <Link to="/" className={styles.homeButton}>
                Voltar para a Loja
            </Link>
        </div>
    );
};

export default StepSuccess;
