import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getCategories, createProduct, updateProduct } from '../../services/products';
import { uploadProductImage } from '../../services/storage';
import styles from './ProductFormModal.module.css';

const UNIT_OPTIONS = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'maco', label: 'Maço' },
    { value: 'dz', label: 'Dúzia (dz)' },
];

const INITIAL_FORM = {
    name: '',
    description: '',
    price: '',
    unit: 'un',
    image_url: '',
    category_id: '',
    is_active: true,
};

const ProductFormModal = ({ product, onClose, onSave }) => {
    const isEditMode = Boolean(product?.id);
    const [form, setForm] = useState(INITIAL_FORM);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Image Upload State
    const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (err) {
                console.error('Error loading categories:', err);
            }
        };
        loadCategories();
    }, []);

    // Pre-fill form in edit mode
    useEffect(() => {
        if (isEditMode && product) {
            setForm({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                unit: product.unit || 'un',
                image_url: product.image_url || '',
                category_id: product.category_id || '',
                is_active: product.is_active ?? true,
            });
            // If has image, set preview
            if (product.image_url) {
                setPreviewUrl(product.image_url);
                setImageMode('upload'); // Default to upload tab to show preview, but acts as "keep existing"
            }
        }
    }, [isEditMode, product]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    // Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Clean up object URL
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const validate = useCallback(() => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!form.price || Number(form.price) <= 0) newErrors.price = 'Preço deve ser maior que zero';
        if (!form.category_id) newErrors.category_id = 'Selecione uma categoria';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form.name, form.price, form.category_id]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validate()) return;

        setLoading(true);
        try {
            let finalImageUrl = form.image_url;

            // Handle Image Upload
            if (imageMode === 'upload' && selectedFile) {
                finalImageUrl = await uploadProductImage(selectedFile);
            } else if (imageMode === 'upload' && !selectedFile && isEditMode) {
                // Keep existing image if in edit mode and no new file selected
                finalImageUrl = product.image_url;
            } else if (imageMode === 'url') {
                finalImageUrl = form.image_url.trim() || null;
            }

            const payload = {
                name: form.name.trim(),
                description: form.description.trim() || null,
                price: parseFloat(form.price),
                unit: form.unit,
                image_url: finalImageUrl,
                category_id: form.category_id || null,
                is_active: form.is_active,
            };

            let savedProduct;
            if (isEditMode) {
                savedProduct = await updateProduct(product.id, payload);
            } else {
                savedProduct = await createProduct(payload);
            }

            // Enriquecer objeto com dados da categoria para a tabela (Optimistic UI)
            if (savedProduct.category_id) {
                const selectedCategory = categories.find(c => c.id === savedProduct.category_id);
                if (selectedCategory) {
                    savedProduct.categories = { name: selectedCategory.name };
                }
            }

            onSave(savedProduct);
        } catch (err) {
            console.error('Error saving product:', err);
            setSubmitError(err.message || 'Erro ao salvar produto. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [form, isEditMode, product, validate, onSave, imageMode, selectedFile]);

    // Close on overlay click
    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {isEditMode ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {submitError && (
                        <div className={styles.errorBanner}>{submitError}</div>
                    )}

                    {/* Nome */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="product-name">
                            Nome <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="product-name"
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ex: Banana Prata"
                        />
                        {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                    </div>

                    {/* Descrição */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="product-description">Descrição</label>
                        <textarea
                            id="product-description"
                            className={styles.textarea}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrição do produto (opcional)"
                            rows={3}
                        />
                    </div>

                    {/* Preço + Unidade (side by side) */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="product-price">
                                Preço (R$) <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="product-price"
                                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                            {errors.price && <span className={styles.fieldError}>{errors.price}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="product-unit">Unidade</label>
                            <select
                                id="product-unit"
                                className={styles.select}
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                            >
                                {UNIT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Categoria */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="product-category">
                                Categoria <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="product-category"
                                className={`${styles.select} ${errors.category_id ? styles.inputError : ''}`}
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                            >
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <span className={styles.fieldError}>{errors.category_id}</span>}
                        </div>
                    </div>

                    {/* Imagem (Tabs: Upload / URL) */}
                    <div className={styles.field}>
                        <label className={styles.label}>Imagem do Produto</label>

                        <div className={styles.tabs}>
                            <button
                                type="button"
                                className={`${styles.tab} ${imageMode === 'upload' ? styles.activeTab : ''}`}
                                onClick={() => setImageMode('upload')}
                            >
                                Upload de Arquivo
                            </button>
                            <button
                                type="button"
                                className={`${styles.tab} ${imageMode === 'url' ? styles.activeTab : ''}`}
                                onClick={() => setImageMode('url')}
                            >
                                URL Externa
                            </button>
                        </div>

                        <div className={styles.tabContent}>
                            {imageMode === 'upload' ? (
                                <div className={styles.uploadContainer}>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                    />
                                    <label htmlFor="file-upload" className={styles.fileLabel}>
                                        {selectedFile ? selectedFile.name : 'Escolher arquivo...'}
                                    </label>

                                    {previewUrl && (
                                        <div className={styles.previewContainer}>
                                            <img src={previewUrl} alt="Preview" className={styles.bigPreview} />
                                            <button
                                                type="button"
                                                className={styles.removePreviewBtn}
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                    // Reset input value to allow selecting same file again
                                                    const input = document.getElementById('file-upload');
                                                    if (input) input.value = '';
                                                }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.urlContainer}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="image_url"
                                        value={form.image_url}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setPreviewUrl(e.target.value);
                                        }}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                    {form.image_url && (
                                        <div className={styles.previewContainer}>
                                            <img
                                                src={form.image_url}
                                                alt="Preview"
                                                className={styles.bigPreview}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ativo */}
                    <div className={styles.checkboxField}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                            <span>Produto ativo (visível no catálogo)</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Produto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
