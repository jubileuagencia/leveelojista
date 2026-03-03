import React from 'react';
import styles from './PromoBanner.module.css';

const PromoBanner = () => {
    return (
        <div className={styles.bannerWrapper}>
            <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>
                    Abasteça sua loja<br />
                    <span className={styles.highlightText}>30% OFF</span> hoje!
                </h2>
                <button className={styles.bannerButton}>Peça agora</button>
            </div>
            <div className={styles.bannerImagePlaceholder}>
                <span className={styles.emojiPlaceholder}>🥦</span>
            </div>
        </div>
    );
};

export default PromoBanner;
