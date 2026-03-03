const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export const sendCartNotification = async (product) => {
    if (!WEBHOOK_URL) {
        console.warn('N8n Webhook URL not configured');
        return;
    }

    const payload = {
        event: 'add_to_cart',
        product_name: product.name,
        product_price: product.price,
        timestamp: new Date().toISOString(),
    };

    try {
        // efficient way to send data without waiting for response (fire and forget)
        // using keepalive: true to ensure request survives page navigation
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            keepalive: true,
        }).catch(err => console.error('N8n Webhook connection error (expected if CORS issues):', err));

        // console.log('Notification sent to N8n:', payload);
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};
