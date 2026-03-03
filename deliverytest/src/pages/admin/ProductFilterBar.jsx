import React, { useState, useEffect, useRef } from 'react';
import { getCategories } from '../../services/products';
import styles from './ProductFilterBar.module.css';

const ProductFilterBar = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState([]);

    // Load categories for the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFilterChange({ search: searchTerm, categoryId, status });
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm, categoryId, status, onFilterChange]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryId('');
        setStatus('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.group}>
                <div className={styles.inputWrapper}>
                    <span className={styles.icon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.group}>
                <select
                    value={categoryId}
                    onChange={handleCategoryChange}
                    className={styles.select}
                >
                    <option value="">Todas as Categorias</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={styles.select}
                >
                    <option value="">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                </select>

                {(searchTerm || categoryId || status) && (
                    <button onClick={handleClearFilters} className={styles.clearBtn}>
                        Limpar Filtros
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductFilterBar;
