import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateOrdersStatus } from '../../services/orders';
import MultiSelectFilter from './components/MultiSelectFilter';
import StatusBadge, { STATUS_CONFIG } from './components/StatusBadge';
import OrderDetailsModal from './OrderDetailsModal';
import styles from './AdminOrders.module.css';

// Extract keys and build labels dynamically from configuration
const STATUS_OPTIONS = Object.keys(STATUS_CONFIG).map(key => ({
    value: key,
    label: STATUS_CONFIG[key].label
}));

const AdminOrders = () => {
    // Basic State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null); // For Details Modal

    // Bulk Selection State
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);
    const [bulkStatusSelect, setBulkStatusSelect] = useState('');

    // Filter State
    const [filterStatuses, setFilterStatuses] = useState([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 30;

    useEffect(() => {
        loadOrders();
    }, [page, filterStatuses]); // Reload when page or filters change

    // Debounce search
    useEffect(() => {
        setPage(1); // Reset to page 1 on new search
        setSelectedOrderIds([]); // Clear selection on search
        const timer = setTimeout(() => {
            loadOrders();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const result = await getAdminOrders(page, PAGE_SIZE, searchTerm, filterStatuses);
            setOrders(result.data || []);

            if (result.data && result.data.length > 0) {
                const total = result.total_count || 0;
                setTotalCount(total);
                setTotalPages(Math.ceil(total / PAGE_SIZE));
            } else {
                setTotalCount(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleOrderUpdated = (updatedOrder) => {
        // Optimistically update list
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            setSelectedOrderIds([]); // Clear selection when changing page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Bulk Actions Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrderIds(orders.map(o => o.id));
        } else {
            setSelectedOrderIds([]);
        }
    };

    const handleSelectOrder = (orderId) => {
        setSelectedOrderIds(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleBulkUpdate = async () => {
        if (!bulkStatusSelect || selectedOrderIds.length === 0) return;

        setIsUpdatingBulk(true);
        try {
            await updateOrdersStatus(selectedOrderIds, bulkStatusSelect);
            // Optimistically update the list
            setOrders(prev => prev.map(o =>
                selectedOrderIds.includes(o.id) ? { ...o, status: bulkStatusSelect } : o
            ));
            // Reset selection
            setSelectedOrderIds([]);
            setBulkStatusSelect('');
        } catch (error) {
            console.error('Failed to update orders in bulk', error);
            alert('Falha ao atualizar pedidos em massa.');
        } finally {
            setIsUpdatingBulk(false);
        }
    };

    // Helper to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    // Helper to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gerenciar Pedidos</h1>
                    <p className={styles.subtitle}>Acompanhe e avance o status das ordens de compra.</p>
                </div>
            </div>

            <div className={styles.filterContainer}>
                <div className={styles.searchWrapper}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.searchIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por Pedido (#), Empresa ou CNPJ..."
                        className={styles.searchInput}
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.filterActions}>
                    <MultiSelectFilter
                        label="Status do Pedido"
                        options={STATUS_OPTIONS}
                        selectedValues={filterStatuses}
                        onChange={(newValues) => { setFilterStatuses(newValues); setPage(1); }}
                    />
                </div>
            </div>

            {loading ? (
                <div>Carregando pedidos...</div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.checkboxCell}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Pedido</th>
                                    <th>Data / Hora</th>
                                    <th>Cliente</th>
                                    <th>Pagamento</th>
                                    <th>Valor Total</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className={styles.checkboxCell}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                checked={selectedOrderIds.includes(order.id)}
                                                onChange={() => handleSelectOrder(order.id)}
                                            />
                                        </td>
                                        <td><strong>#{order.order_number}</strong></td>
                                        <td className={styles.secondaryText}>{formatDate(order.created_at)}</td>
                                        <td>
                                            <strong>{order.profile?.company_name || 'Desconhecido'}</strong>
                                            <div className={styles.secondaryText}>
                                                CNPJ: {order.profile?.cnpj || '-'}
                                            </div>
                                        </td>
                                        <td className={styles.secondaryText}>
                                            <span style={{ textTransform: 'uppercase' }}>{order.payment_method}</span>
                                        </td>
                                        <td className={styles.totalText}>{formatCurrency(order.total)}</td>
                                        <td>
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td>
                                            <button className={styles.viewBtn} onClick={() => handleViewClick(order)}>
                                                Abrir Pedido
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#666' }}>
                                            Nenhum pedido encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className={styles.mobileCards}>
                        {orders.map(order => (
                            <div key={order.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            style={{ marginTop: '4px' }}
                                            checked={selectedOrderIds.includes(order.id)}
                                            onChange={() => handleSelectOrder(order.id)}
                                        />
                                        <div>
                                            <strong style={{ fontSize: '1.1rem' }}>#{order.order_number}</strong>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
                                                {order.profile?.company_name || 'Desconhecido'}
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.cardLabel}>Data:</span>
                                    <span>{formatDate(order.created_at)}</span>
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.cardLabel}>Pagamento:</span>
                                    <span style={{ textTransform: 'uppercase' }}>{order.payment_method}</span>
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.cardLabel}>Total:</span>
                                    <strong className={styles.totalText}>{formatCurrency(order.total)}</strong>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <button className={styles.viewBtn} style={{ width: '100%' }} onClick={() => handleViewClick(order)}>
                                        Abrir Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                Anterior
                            </button>
                            <span className={styles.pageInfo}>
                                Página {page} de {totalPages} ({totalCount} pedidos)
                            </span>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                            >
                                Próximo
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Mass Actions Bar */}
            {selectedOrderIds.length > 0 && (
                <div className={styles.actionBar}>
                    <span className={styles.actionBarSelected}>
                        {selectedOrderIds.length} {selectedOrderIds.length === 1 ? 'pedido selecionado' : 'pedidos selecionados'}
                    </span>
                    <select
                        className={styles.actionSelect}
                        value={bulkStatusSelect}
                        onChange={(e) => setBulkStatusSelect(e.target.value)}
                    >
                        <option value="">Alterar status para...</option>
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button
                        className={styles.actionBtn}
                        disabled={!bulkStatusSelect || isUpdatingBulk}
                        onClick={handleBulkUpdate}
                    >
                        {isUpdatingBulk ? 'Aplicando...' : 'Aplicar'}
                    </button>
                </div>
            )}

            {/* Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    orderSummary={selectedOrder}
                    onClose={handleCloseModal}
                    onUpdate={handleOrderUpdated}
                />
            )}
        </div>
    );
};

export default AdminOrders;
