import React, { useEffect, useState, useRef } from 'react';
import { getProductById } from '../services/products';
import styles from './ProductDetailsModal.module.css';
import { useTierPrice } from '../hooks/useTierPrice';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const PriceDisplay = ({ price }) => {
    const { finalPrice, discountApplied, originalPrice } = useTierPrice(price);

    return (
        <div className={styles.priceContainer}>
            {discountApplied && (
                <span className={styles.oldPrice}>
                    R$ {originalPrice.toFixed(2).replace('.', ',')}
                </span>
            )}
            <div className={styles.priceWrapper}>
                <span className={styles.price}>R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                <span className={styles.unit}>/ unidade</span>
            </div>
        </div>
    );
};

const AddToCartButton = ({ product, quantity, onAddToCart }) => {
    const { finalPrice } = useTierPrice(product.price);

    return (
        <button
            className={styles.addButton}
            onClick={() => onAddToCart(product)}
        >
            Adicionar à Sacola - R$ {finalPrice.toFixed(2).replace('.', ',')}
        </button>
    );
};

const ProductDetailsModal = ({ productId, onClose }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [closing, setClosing] = useState(false);

    const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuth(); // Need to access auth context or just check user in toggleFavorite but checking user here allows redirect
    // Assuming useAuth isn't imported yet or we can use the context
    // Wait, I imported it in previous step.

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        // Determine navigate or window location if navigate not available? 
        // ProductDetailsModal usually is inside Router so useNavigate should work if imported, 
        // but let's check imports. logic:
        if (toggleFavorite(product?.id) === false) { // If it returns false (blocked)
            // ideally redirect, but we need navigate. 
            // For now let's just use window.location or simply ignore if logic is inside context.
            // Actually create context handles the "return false" if no user.
            // Let's rely on user check here.
        }
    };

    // Gesture State
    const [dragY, setDragY] = useState(0);
    const startY = useRef(0);
    const isDragging = useRef(false);
    const contentRef = useRef(null);

    const cartItem = cartItems?.find(item => item.id === product?.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                if (typeof productId === 'object') {
                    setProduct(productId);
                    setLoading(false);
                } else {
                    const data = await getProductById(productId);
                    setProduct(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to load product", error);
                setLoading(false);
            }
        };

        if (productId) {
            loadProduct();
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [productId]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
            setClosing(false);
            setDragY(0);
        }, 300);
    };

    const handleIncrement = () => {
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else {
            removeFromCart(product.id);
        }
    };

    // Touch Handlers
    const handleTouchStart = (e) => {
        // Only allow dragging if at top of scroll
        if (contentRef.current && contentRef.current.scrollTop > 5) return;

        startY.current = e.touches[0].clientY;
        isDragging.current = true;
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only allow dragging down
        if (diff > 0) {
            setDragY(diff);
            // Prevent default to stop scrolling while dragging
            if (e.cancelable) e.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        if (dragY > 100) { // Threshold to close
            handleClose();
        } else {
            setDragY(0); // Snap back
        }
    };

    if (!productId && !closing) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div
                className={styles.sheet}
                style={{
                    transform: closing ? 'translateY(100%)' : `translateY(${dragY}px)`,
                    transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Handle / Drag Area */}
                <div
                    className={styles.dragArea}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={styles.handle}></div>
                </div>

                {loading ? (
                    <div className={styles.loading}>Carregando...</div>
                ) : !product ? (
                    <div className={styles.error}>Produto não encontrado.</div>
                ) : (
                    <>
                        {/* Scrollable Content Wrapper - Contains Image AND Details */}
                        <div className={styles.content} ref={contentRef}>

                            {/* Header Image Area (Now inside scrollable area) */}
                            <div className={styles.headerImageArea}>
                                <button className={styles.closeButton} onClick={handleClose}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                                </button>

                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className={styles.productImage} />
                                ) : (
                                    <div className={styles.placeholder}>🥦</div>
                                )}

                                <button className={styles.favoriteButton} onClick={(e) => {
                                    e.stopPropagation();
                                    if (!user) {
                                        // rudimentary redirect if no navigate
                                        window.location.href = '/login';
                                        return;
                                    }
                                    toggleFavorite(product.id, product);
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite(product.id) ? "#EF4444" : "none"} stroke={isFavorite(product.id) ? "#EF4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>

                                <div className={styles.imageOverlay} />
                            </div>

                            <div className={styles.detailsBody}>
                                <div className={styles.detailsHeader}>
                                    <h1 className={styles.title}>{product.name}</h1>
                                    <PriceDisplay price={product.price} />
                                </div>

                                <div className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Descrição</h3>
                                    <p className={styles.description}>
                                        {product.description || "Sem descrição disponível para este produto."}
                                    </p>
                                </div>

                                <div className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Categoria</h3>
                                    <div className={styles.badgeWrapper}>
                                        <span className={styles.badge}>
                                            {product.categories?.name || "Geral"}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ height: '100px' }}></div>
                            </div>
                        </div>

                        {/* Fixed Bottom Action Bar */}
                        <div className={styles.actionBar}>
                            {quantity === 0 ? (
                                <AddToCartButton product={product} quantity={quantity} onAddToCart={addToCart} />
                            ) : (
                                <div className={styles.quantityControl}>
                                    <button className={styles.qtyButton} onClick={handleDecrement}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                    <div className={styles.qtyInfo}>
                                        <span className={styles.qtyValue}>{quantity}</span>
                                        <span className={styles.qtyLabel}>unidades</span>
                                    </div>
                                    <button className={styles.qtyButton} onClick={handleIncrement}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsModal;
