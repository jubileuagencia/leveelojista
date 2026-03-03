import React from 'react';
import styles from './ProductCard.module.css';

import { useTierPrice } from '../hooks/useTierPrice';

const ProductCard = ({ product, onAdd, onClick }) => {
    const { finalPrice, discountApplied, originalPrice } = useTierPrice(product.price);

    return (
        <div className={styles.card} onClick={() => onClick && onClick(product)}>
            <div className={styles.imagePlaceholder}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className={styles.productImage} loading="lazy" />
                ) : (
                    <div className={styles.placeholderText}>Imagem</div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.contentBody}>
                    <div>
                        <h3 className={styles.title}>{product.name}</h3>
                        {product.description && (
                            <p className={styles.description}>{product.description}</p>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.priceContainer}>
                        {discountApplied && (
                            <span className={styles.oldPrice}>
                                R$ {originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                        )}
                        <span className={styles.price}>
                            R$ {finalPrice.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent opening modal when clicking add
                            onAdd(product);
                        }}
                        aria-label="Adicionar ao carrinho"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
