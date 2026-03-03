import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/products';
import ProductGrid from '../components/products/ProductGrid';
import { useCart } from '../context/CartContext';
import styles from './SearchPage.module.css';

const SearchPage = ({ onProductClick }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const navigate = useNavigate();

    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialQuery);

    // Debounced Search Logic
    useEffect(() => {
        const timerId = setTimeout(async () => {
            if (searchTerm.length >= 3) {
                setLoading(true);
                try {
                    const results = await searchProducts(searchTerm);
                    setProducts(results || []);
                } catch (err) {
                    console.error(err);
                    setProducts([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setProducts([]);
                setLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Handle input change
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
    };

    return (
        <div className={styles.page}>
            {/* Header / Search Bar */}
            <div className={styles.header}>
                <Link to="/" className={styles.backButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                </Link>
                <div className={styles.searchForm}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Digite pelo menos 3 letras..."
                        className={styles.searchInput}
                        autoFocus
                    />
                    {loading && (
                        <div className={styles.spinnerWrapper}>
                            <div className={styles.spinner}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>Buscando...</div>
                ) : (
                    <>
                        {searchTerm.length >= 3 && (
                            <h2 className={styles.resultsTitle}>
                                {products.length} resultados para "{searchTerm}"
                            </h2>
                        )}

                        {products.length === 0 ? (
                            <div className={styles.emptyState}>
                                {searchTerm.length < 3 ? (
                                    <>
                                        <span className={styles.emptyIcon}>⌨️</span>
                                        <p>Digite o nome do produto</p>
                                        <p className={styles.emptyText}>Mínimo de 3 letras para buscar.</p>
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.emptyIcon}>🔍</span>
                                        <p>Nenhum produto encontrado.</p>
                                        <p className={styles.emptyText}>Tente termos diferentes como "banana" ou "tomate".</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <ProductGrid
                                products={products}
                                onAdd={addToCart}
                                onClick={onProductClick}
                                cartItems={cartItems}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeFromCart}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
