import React, { useEffect, useState, useCallback } from 'react';
import { getAdminProducts, deleteProduct, toggleProductStatus, bulkDeleteProducts, bulkUpdateStatus } from '../../services/products';
import AdminProductTable from './AdminProductTable';
import ProductFormModal from './ProductFormModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ProductFilterBar from './ProductFilterBar';
import styles from './AdminProducts.module.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalProduct, setModalProduct] = useState(null); // null=closed, {}=create, {id,...}=edit
    const [productToDelete, setProductToDelete] = useState(null); // null=closed, {product}=open confirmation
    const [productToToggle, setProductToToggle] = useState(null); // null=closed, {product}=open confirmation
    const [bulkAction, setBulkAction] = useState(null); // null=closed, {type: 'delete'|'activate'|'deactivate'}

    useEffect(() => {
        loadProducts();
    }, [filters]);

    // Clear selection when filters change
    useEffect(() => {
        setSelectedIds([]);
    }, [filters]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data } = await getAdminProducts(0, 200, filters);
            setProducts(data || []);
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // Selection Logic
    const handleSelectAll = useCallback((e) => {
        if (e.target.checked) {
            const allIds = products.map(p => p.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    }, [products]);

    const handleSelectOne = useCallback((id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    }, []);

    // Bulk Actions Handlers
    const handleBulkClick = (type) => {
        setBulkAction({ type });
    };

    const confirmBulkAction = async () => {
        if (!bulkAction) return;

        try {
            if (bulkAction.type === 'delete') {
                await bulkDeleteProducts(selectedIds);
                // Optimistic: remove selected
                setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
            } else if (bulkAction.type === 'activate') {
                await bulkUpdateStatus(selectedIds, true);
                // Optimistic: update status
                setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, is_active: true } : p));
            } else if (bulkAction.type === 'deactivate') {
                await bulkUpdateStatus(selectedIds, false);
                // Optimistic: update status
                setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, is_active: false } : p));
            }
            setSelectedIds([]);
            setBulkAction(null);
        } catch (error) {
            alert('Erro na ação em massa: ' + error.message);
            loadProducts(); // Revert on error
            setBulkAction(null);
        }
    };

    const cancelBulkAction = () => {
        setBulkAction(null);
    };

    // ... (Single Actions - Same as before)
    const handleCreate = useCallback(() => {
        setModalProduct({});
    }, []);

    const handleEdit = useCallback((product) => {
        setModalProduct(product);
    }, []);

    const handleDeleteClick = useCallback((product) => {
        setProductToDelete(product);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!productToDelete) return;

        try {
            await deleteProduct(productToDelete.id);
            // Optimistic update: remove from list
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
            setProductToDelete(null);
        } catch (err) {
            alert('Erro ao excluir produto: ' + (err.message || 'Tente novamente.'));
            setProductToDelete(null);
        }
    }, [productToDelete]);

    const handleCancelDelete = useCallback(() => {
        setProductToDelete(null);
    }, []);

    const handleToggleStatusClick = useCallback((product) => {
        setProductToToggle(product);
    }, []);

    const handleConfirmToggle = useCallback(async () => {
        if (!productToToggle) return;

        try {
            const newStatus = !productToToggle.is_active;
            await toggleProductStatus(productToToggle.id, newStatus);
            // Optimistic update: update status in list
            setProducts(prev => prev.map(p =>
                p.id === productToToggle.id ? { ...p, is_active: newStatus } : p
            ));
            setProductToToggle(null);
        } catch (err) {
            alert('Erro ao alterar status: ' + (err.message || 'Tente novamente.'));
            loadProducts();
            setProductToToggle(null);
        }
    }, [productToToggle]);

    const handleCancelToggle = useCallback(() => {
        setProductToToggle(null);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalProduct(null);
    }, []);

    const handleModalSave = useCallback((savedProduct) => {
        setProductModal(null); // Close modal

        // Optimistic update: add or update in list
        if (savedProduct) {
            setProducts(prev => {
                const exists = prev.find(p => p.id === savedProduct.id);
                if (exists) {
                    // Update existing
                    return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
                }
                // Add new (at top)
                return [savedProduct, ...prev];
            });
        } else {
            // Fallback if no product returned (shouldn't happen with current modal logic)
            loadProducts();
        }
    }, []);

    // Fix: setProductModal typo in handleModalSave
    const setProductModal = setModalProduct;

    // Bulk Actions Bar Component (Inline for now, can move later)
    const BulkActionsBar = () => {
        if (selectedIds.length === 0) return null;

        return (
            <div className={styles.bulkBar}>
                <span className={styles.selectedCount}>{selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}</span>
                <div className={styles.bulkActions}>
                    <button className={styles.bulkBtn} onClick={() => handleBulkClick('activate')}>Ativar</button>
                    <button className={styles.bulkBtn} onClick={() => handleBulkClick('deactivate')}>Desativar</button>
                    <button className={`${styles.bulkBtn} ${styles.destructive}`} onClick={() => handleBulkClick('delete')}>Excluir</button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gerenciar Produtos</h1>
                    <p className={styles.subtitle}>Visualize e gerencie o catálogo da loja.</p>
                </div>
                <button className={styles.createBtn} onClick={handleCreate}>
                    + Novo Produto
                </button>
            </div>

            <ProductFilterBar onFilterChange={handleFilterChange} />

            <BulkActionsBar />

            {loading ? (
                <div className={styles.loading}>Carregando produtos...</div>
            ) : (
                <AdminProductTable
                    products={products}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onToggleStatus={handleToggleStatusClick}
                />
            )}

            {/* Product Form Modal */}
            {modalProduct !== null && (
                <ProductFormModal
                    product={modalProduct.id ? modalProduct : null}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}

            {/* Single Delete Confirmation */}
            <ConfirmationModal
                isOpen={!!productToDelete}
                title="Excluir Produto"
                message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Ele não será mais visível no catálogo.`}
                confirmText="Excluir"
                isDestructive={true}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* Single Toggle Confirmation */}
            <ConfirmationModal
                isOpen={!!productToToggle}
                title={productToToggle?.is_active ? "Desativar Produto" : "Ativar Produto"}
                message={`Tem certeza que deseja ${productToToggle?.is_active ? 'desativar' : 'ativar'} o produto "${productToToggle?.name}"?`}
                confirmText={productToToggle?.is_active ? "Desativar" : "Ativar"}
                isDestructive={productToToggle?.is_active}
                onConfirm={handleConfirmToggle}
                onCancel={handleCancelToggle}
            />

            {/* Bulk Action Confirmation */}
            <ConfirmationModal
                isOpen={!!bulkAction}
                title={
                    bulkAction?.type === 'delete' ? 'Excluir Produtos' :
                        bulkAction?.type === 'activate' ? 'Ativar Produtos' : 'Desativar Produtos'
                }
                message={
                    bulkAction?.type === 'delete' ? `Tem certeza que deseja excluir ${selectedIds.length} produtos?` :
                        `Tem certeza que deseja ${bulkAction?.type === 'activate' ? 'ativar' : 'desativar'} ${selectedIds.length} produtos?`
                }
                confirmText={bulkAction?.type === 'delete' ? 'Excluir' : 'Confirmar'}
                isDestructive={bulkAction?.type === 'delete' || bulkAction?.type === 'deactivate'}
                onConfirm={confirmBulkAction}
                onCancel={cancelBulkAction}
            />
        </div>
    );
};

export default AdminProducts;
