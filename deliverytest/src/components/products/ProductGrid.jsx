import React from 'react';
import ProductCard from '../ProductCard';
import styles from './ProductGrid.module.css';

const ProductGrid = ({ products, onAdd, onClick, cartItems, onUpdateQuantity, onRemoveItem }) => {
    return (
        <div className={styles.grid}>
            {products.map(product => (
                <div key={product.id} className={styles.cardWrapper}>
                    <ProductCard
                        product={product}
                        onAdd={onAdd}
                        onClick={onClick}
                        cartItems={cartItems}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
