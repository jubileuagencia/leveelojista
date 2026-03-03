import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <h1 className={`premium-gradient-text ${styles.title}`}>Delicious Food</h1>
                <p className={styles.subtitle}>Delivered right to your doorstep.</p>
            </div>
        </section>
    );
};

export default Hero;
