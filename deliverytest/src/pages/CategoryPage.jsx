import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory } from '../services/products';
import PageHeader from '../components/common/PageHeader';
import ProductGrid from '../components/products/ProductGrid';
import styles from './CategoryPage.module.css';
import { useCart } from '../context/CartContext';

const CategoryPage = ({ onProductClick }) => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

    // Reset state when category changes
    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
        loadProducts(0, true);
    }, [categoryName]);

    const loadProducts = async (pageIndex, isRefresh = false) => {
        setLoading(true);
        try {
            const newProducts = await getProductsByCategory(categoryName, pageIndex, LIMIT);

            if (newProducts.length < LIMIT) {
                setHasMore(false);
            }

            if (isRefresh) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }
        } catch (error) {
            console.error("Failed to load category products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage);
    };

    return (
        <div className={`container ${styles.page}`}>
            <PageHeader title={categoryName} />

            {products.length === 0 && !loading ? (
                <div className={styles.empty}>
                    Nenhum produto encontrado nesta categoria.
                </div>
            ) : (
                <>
                    <ProductGrid
                        products={products}
                        onAdd={addToCart}
                        onClick={onProductClick}
                        cartItems={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeFromCart}
                    />

                    {hasMore && (
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Carregando...' : 'Carregar Mais'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryPage;
