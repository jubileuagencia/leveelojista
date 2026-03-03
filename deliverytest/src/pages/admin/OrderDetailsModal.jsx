import React, { useEffect, useState } from 'react';
import { getOrderDetails, updateOrderStatus } from '../../services/orders';
import StatusBadge, { STATUS_CONFIG } from './components/StatusBadge';
import { formatCNPJ, formatPhone } from '../../utils/validation';
import styles from './OrderDetailsModal.module.css';

const OrderDetailsModal = ({ orderSummary, onClose, onUpdate }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (orderSummary?.id) {
            loadFullDetails(orderSummary.id);
        }
    }, [orderSummary]);

    const loadFullDetails = async (id) => {
        setLoading(true);
        try {
            const data = await getOrderDetails(id);
            setOrder(data);
        } catch (error) {
            console.error('Failed to load order details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!order || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            setOrder(prev => ({ ...prev, status: newStatus }));
            if (onUpdate) {
                // Update parent list optimistically
                onUpdate({ ...orderSummary, status: newStatus });
            }
        } catch (error) {
            console.error('Error changing order status', error);
            alert('Falha ao atualizar o status do pedido.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (!orderSummary) return null;

    // Next logical steps logic
    const renderActionButtons = (currentStatus) => {
        switch (currentStatus) {
            case 'pending':
            case 'approved':
                return (
                    <button
                        className={styles.primaryBtn}
                        onClick={() => handleStatusChange('preparing')}
                        disabled={updatingStatus}
                    >
                        Iniciar Separação
                    </button>
                );
            case 'preparing':
                return (
                    <button
                        className={styles.primaryBtnAction}
                        onClick={() => handleStatusChange('shipped')}
                        disabled={updatingStatus}
                    >
                        Marcar como Enviado
                    </button>
                );
            case 'shipped':
                return (
                    <button
                        className={styles.successBtn}
                        onClick={() => handleStatusChange('delivered')}
                        disabled={updatingStatus}
                    >
                        Confirmar Entrega
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.title}>Detalhes do Pedido</h2>
                        <span className={styles.idText}>Pedido #{orderSummary.order_number}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                {loading ? (
                    <div className={styles.loadingState}>Carregando informações do pedido...</div>
                ) : order ? (
                    <div className={styles.modalBody}>

                        {/* Status Pipeline & Actions */}
                        <div className={styles.statusPanel}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className={styles.panelLabel}>Status Atual:</span>
                                <StatusBadge status={order.status} />
                            </div>
                            <div className={styles.actionsGrp}>
                                {renderActionButtons(order.status)}
                                {(order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'rejected') && (
                                    <button
                                        className={styles.dangerBtn}
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={updatingStatus}
                                    >
                                        Cancelar Pedido
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Two Column Layout for Info */}
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <h3 className={styles.boxTitle}>Dados do Cliente</h3>
                                <p><strong>{order.profile?.company_name || 'Desconhecido'}</strong></p>
                                <p>CNPJ: {formatCNPJ(order.profile?.cnpj) || '-'}</p>
                                <p>Email: {order.profile?.email || '-'}</p>
                                <p>Tefelone: {formatPhone(order.profile?.phone) || '-'}</p>
                            </div>

                            <div className={styles.infoBox}>
                                <h3 className={styles.boxTitle}>Dados de Entrega</h3>
                                {order.address ? (
                                    <>
                                        <p>{order.address.street}, {order.address.number}</p>
                                        <p>{order.address.district} - {order.address.city}/{order.address.state}</p>
                                        <p>CEP: {order.address.zip_code}</p>
                                    </>
                                ) : (
                                    <p style={{ color: '#666' }}>Endereço não disponível.</p>
                                )}
                                <div style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#666' }}>Feito em: </span>
                                    {formatDate(order.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className={styles.itemsSection}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 className={styles.boxTitle} style={{ margin: 0 }}>Itens do Pedido</h3>
                                <button className={styles.outlineBtn} disabled>
                                    Imprimir Separação (Em Breve)
                                </button>
                            </div>

                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th style={{ textAlign: 'right' }}>Qtd.</th>
                                            <th style={{ textAlign: 'right' }}>Preço Un.</th>
                                            <th style={{ textAlign: 'right' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(order.items || []).map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {item.product?.image_url ? (
                                                            <img src={item.product.image_url} alt="" className={styles.itemImg} />
                                                        ) : (
                                                            <div className={styles.itemImgPlaceholder} />
                                                        )}
                                                        <span>{item.product?.name || 'Produto Removido'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>{item.quantity} {item.product?.unit || 'un'}</td>
                                                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                                                <td style={{ textAlign: 'right', fontWeight: '500' }}>{formatCurrency(item.total_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Totals */}
                        <div className={styles.totalsSection}>
                            <div className={styles.totalsBox}>
                                <div className={styles.totalRow}>
                                    <span>Forma de Pagamento:</span>
                                    <strong style={{ textTransform: 'uppercase' }}>{order.payment_method}</strong>
                                </div>
                                <hr className={styles.divider} />
                                <div className={styles.totalRow}>
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Descontos (Tier):</span>
                                    <span style={{ color: '#059669' }}>- {formatCurrency(order.discount)}</span>
                                </div>
                                <div className={styles.totalRow} style={{ marginTop: '8px', fontSize: '1.25rem' }}>
                                    <strong>Total:</strong>
                                    <strong>{formatCurrency(order.total)}</strong>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className={styles.loadingState}>Erro ao buscar detalhes do pedido.</div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsModal;
