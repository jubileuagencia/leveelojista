import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderCard.module.css';

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

    const getStatusInfo = (status) => {
        const map = {
            pending: { label: 'Aguardando Aprovação', color: '#F59E0B', icon: '🕒' },
            approved: { label: 'Pedido Aceito', color: '#10B981', icon: '✅' },
            preparing: { label: 'Em Separação', color: '#3B82F6', icon: '📦' },
            shipped: { label: 'Saiu para Entrega', color: '#8B5CF6', icon: '🛵' },
            delivered: { label: 'Pedido Concluído', color: '#10B981', icon: '🏠' },
            rejected: { label: 'Negado', color: '#EF4444', icon: '❌' },
            cancelled: { label: 'Cancelado', color: '#EF4444', icon: '🚫' },
        };
        return map[status] || map.pending;
    };

    const statusInfo = getStatusInfo(order.status);
    const firstItem = order.items?.[0];
    const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const remainingItems = totalItems - 1;

    return (
        <div className={styles.card} onClick={() => navigate(`/pedido/${order.id}`)}>
            <div className={styles.header}>
                <div className={styles.store}>
                    <div className={styles.storeIcon}>🛍️</div>
                    <span className={styles.storeName}>Pedido #{order.order_number}</span>
                </div>
                <div className={styles.status} style={{ color: statusInfo.color }}>
                    {statusInfo.label} {statusInfo.icon}
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.itemsList}>
                    {firstItem && (
                        <div className={styles.itemRow}>
                            <span className={styles.qty}>{firstItem.quantity}</span>
                            <span className={styles.itemName}>{firstItem.product?.name}</span>
                        </div>
                    )}
                    {remainingItems > 0 && (
                        <div className={styles.moreItems}>
                            +{remainingItems} itens
                        </div>
                    )}
                </div>

                {firstItem?.product?.image_url && (
                    <img
                        src={firstItem.product.image_url}
                        alt="Product"
                        className={styles.thumb}
                    />
                )}
            </div>

            <div className={styles.footer}>
                <button className={styles.detailsButton}>
                    Ver detalhes
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
