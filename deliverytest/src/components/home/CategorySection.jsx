import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategorySection.module.css';

const CategoryItem = ({ icon, name, color }) => (
    <Link to={`/categoria/${name}`} className={styles.categoryItem}>
        <div className={styles.categoryCircle} style={{ backgroundColor: color }}>
            <span className={styles.categoryIcon}>{icon}</span>
        </div>
        <span className={styles.categoryName}>{name}</span>
    </Link>
);

const CategorySection = ({ categories }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.sectionTitle}>Categorias</h3>
                <span className={styles.seeAll}>Ver todas</span>
            </div>
            <div className={styles.categoryGrid}>
                {categories.map(category => (
                    <CategoryItem
                        key={category.id}
                        icon={category.icon}
                        name={category.name}
                        color={category.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategorySection;
