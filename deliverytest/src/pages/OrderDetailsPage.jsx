import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../services/orders';
import styles from './OrderDetailsPage.module.css';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getOrderDetails(id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: 100 }}>Carregando detalhes...</div>;
    if (!order) return <div className="container" style={{ paddingTop: 100 }}>Pedido não encontrado.</div>;

    const getStatusInfo = (status) => {
        const map = {
            pending: { label: 'Aguardando Aprovação', color: '#F59E0B' },
            approved: { label: 'Pedido Aceito', color: '#10B981' },
            preparing: { label: 'Em Separação', color: '#3B82F6' },
            shipped: { label: 'Saiu para Entrega', color: '#8B5CF6' },
            delivered: { label: 'Pedido Concluído', color: '#10B981' },
            rejected: { label: 'Negado', color: '#EF4444' },
            cancelled: { label: 'Cancelado', color: '#EF4444' },
        };
        return map[status] || map.pending;
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    ← Voltar
                </button>
                <h3>Pedido #{order.order_number}</h3>
            </div>

            <div className={styles.statusBanner} style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
                <span className={styles.statusLabel}>{statusInfo.label}</span>
                <span className={styles.date}>{new Date(order.created_at).toLocaleString()}</span>
            </div>

            <div className={styles.section}>
                <h4>Itens</h4>
                <div className={styles.items}>
                    {order.items.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                                <span className={styles.qty}>{item.quantity}x</span>
                                <span>{item.product?.name}</span>
                            </div>
                            <span>R$ {item.total_price.toFixed(2).replace('.', ',')}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4>Entrega</h4>
                {order.address && (
                    <p className={styles.text}>
                        {order.address.street}, {order.address.number}<br />
                        {order.address.district} - {order.address.city}/{order.address.state}
                    </p>
                )}
            </div>

            <div className={styles.summary}>
                <div className={styles.row}>
                    <span>Subtotal</span>
                    <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {order.discount > 0 && (
                    <div className={styles.row}>
                        <span>Desconto</span>
                        <span style={{ color: 'green' }}>- R$ {order.discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                )}
                <div className={`${styles.row} ${styles.total}`}>
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.helpButton}>
                    Preciso de Ajuda
                </button>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
