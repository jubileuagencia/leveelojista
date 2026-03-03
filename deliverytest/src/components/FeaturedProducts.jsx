import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import { getProducts } from '../services/products';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts = ({ onAddToCart, onProductClick }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(6);
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    console.warn('No products found in DB. Showing empty state.');
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading products...</div>;
    }

    return <Carousel products={products} onAdd={onAddToCart} onClick={onProductClick} />;
};

export default FeaturedProducts;
