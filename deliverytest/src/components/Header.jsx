import React, { useState } from 'react';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Location (Left) */}
        <div className={styles.locationWrapper}>
          <span className={styles.locationLabel}>Sede de Entrega</span>
          <div className={styles.locationValue}>
            Pão de Jubileu II Guarani
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIcon}><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>

        {/* Right Actions (Bell, Cart, Auth) */}
        <div className={styles.rightActions}>
          {/* Notification Bell */}
          <button className={styles.iconButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className={styles.notifBadge}></span>
          </button>

          {/* Cart Button (Green) */}
          <Link to="/carrinho" className={styles.cartButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {/* Always show cart count if > 0 */}
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {/* Login / Profile */}
          {user ? (
            <div className={styles.userSection} onClick={toggleMenu}>
              <span className={styles.userBadge}>
                {user.email?.split('@')[0]}
              </span>
            </div>
          ) : (
            <Link to="/login" className={styles.loginLink}>
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay - Kept for reference but hidden in this design unless we add back the hamburger */}
      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuContent}>
            <button className={styles.closeButton} onClick={toggleMenu}>&times;</button>
            <nav className={styles.navLinks}>
              <Link to="/" onClick={toggleMenu}>Início</Link>
              <Link to="/carrinho" onClick={toggleMenu}>Carrinho</Link>
              {user ? (
                <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
              ) : (
                <Link to="/login" onClick={toggleMenu} className={styles.loginLink}>Entrar</Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
