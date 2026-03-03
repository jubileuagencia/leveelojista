import React from 'react';
import ProductCard from './ProductCard';
import styles from './Carousel.module.css';

const Carousel = ({ products, onAdd, onClick }) => {
    return (
        <div className={styles.carouselContainer}>
            <div className={styles.scrollArea}>
                <div className={styles.spacer} /> {/* Left padding matcher */}
                {products.map((product) => (
                    <div key={product.id} className={styles.cardWrapper}>
                        <ProductCard product={product} onAdd={onAdd} onClick={onClick} />
                    </div>
                ))}
                <div className={styles.endSpacer} /> {/* Minimal right padding */}
            </div>
        </div>
    );
};

export default Carousel;
