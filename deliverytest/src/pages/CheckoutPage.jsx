import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { createOrder } from '../services/orders';

import CheckoutWizard from '../components/checkout/CheckoutWizard';
import StepAddress from '../components/checkout/StepAddress';
import StepPayment from '../components/checkout/StepPayment';
import StepReview from '../components/checkout/StepReview';
import StepSuccess from '../components/checkout/StepSuccess';

import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const { cartItems, loading: cartLoading, removeFromCart, clearCart } = useCart();
    const { config } = useConfig();

    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);

    // Order Data State
    const [address, setAddress] = useState(null);
    const [payment, setPayment] = useState(null);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(false);

    // Totals State (Re-calculated here for safety)
    const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0, tier: 'bronze' });

    useEffect(() => {
        if (!user && !cartLoading) {
            navigate('/login'); // Redirect to login, not auth (assuming /login exists, based on App.jsx)
        }
        if (cartItems.length === 0 && currentStep < 4 && !cartLoading && !createdOrderId) {
            navigate('/carrinho');
        }
    }, [user, cartItems, cartLoading, navigate, currentStep, createdOrderId]);

    // Calculate Totals Effect
    useEffect(() => {
        if (cartItems.length === 0) return;

        const baseSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

        // Read tier from AuthContext (already loaded)
        const tier = profile?.tier || 'bronze';

        const discounts = config.tier_discounts || {};
        const discountPercent = discounts[tier] || 0;
        const discountAmount = baseSubtotal * discountPercent;

        setTotals({
            subtotal: baseSubtotal,
            discount: discountAmount,
            total: baseSubtotal - discountAmount,
            tier
        });
    }, [cartItems, profile?.tier, config.tier_discounts]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleAddressSubmit = (selectedAddress) => {
        setAddress(selectedAddress);
        nextStep();
    };

    const handlePaymentSubmit = (selectedPayment) => {
        setPayment(selectedPayment);
        nextStep();
    };

    const handleFinalSubmit = async () => {
        setLoadingOrder(true);
        try {
            const order = await createOrder({
                address_id: address.id,
                payment_method: payment,
                cartItems: cartItems,
                subtotal: totals.subtotal,
                discount: totals.discount,
                total: totals.total
            });

            setCreatedOrderId(order.id);

            // Clear Cart Optimized
            await clearCart();

            nextStep(); // Go to Success
        } catch (error) {
            alert('Erro ao criar pedido: ' + error.message);
        } finally {
            setLoadingOrder(false);
        }
    };

    if (cartLoading) return <div className="container">Carregando...</div>;

    return (
        <div className={`container ${styles.page}`}>
            <h2 className={styles.title}>Finalizar Pedido</h2>

            <CheckoutWizard currentStep={currentStep}>
                {currentStep === 1 && (
                    <StepAddress onNext={handleAddressSubmit} />
                )}

                {currentStep === 2 && (
                    <StepPayment onNext={handlePaymentSubmit} />
                )}

                {currentStep === 3 && (
                    <StepReview
                        address={address}
                        payment={payment}
                        cartItems={cartItems}
                        totals={totals}
                        onSubmit={handleFinalSubmit}
                        loading={loadingOrder}
                    />
                )}

                {currentStep === 4 && (
                    <StepSuccess orderId={createdOrderId} paymentMethod={payment} />
                )}
            </CheckoutWizard>
        </div>
    );
};

export default CheckoutPage;
