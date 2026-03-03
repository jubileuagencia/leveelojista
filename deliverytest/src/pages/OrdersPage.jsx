import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../services/orders';
import OrderCard from '../components/orders/OrderCard';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getUserOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: 100 }}>Carregando pedidos...</div>;

    return (
        <div className={`container ${styles.page}`}>
            <h2 className={styles.title}>Meus Pedidos</h2>

            {orders.length === 0 ? (
                <div className={styles.empty}>
                    <p>Você ainda não fez nenhum pedido.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {orders.map(order => (
                        <div key={order.id} className={styles.group}>
                            <h4 className={styles.date}>
                                {new Date(order.created_at).toLocaleDateString()}
                            </h4>
                            <OrderCard order={order} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
