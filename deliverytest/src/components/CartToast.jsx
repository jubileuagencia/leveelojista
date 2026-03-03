import React, { useEffect } from 'react';
import styles from './CartToast.module.css';

const CartToast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Disappear after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.toast}>
            <div className={styles.content}>
                <span className={styles.icon}>✅</span>
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    );
};

export default CartToast;
