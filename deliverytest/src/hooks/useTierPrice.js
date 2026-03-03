import { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';

export const useTierPrice = (basePrice) => {
    const [finalPrice, setFinalPrice] = useState(basePrice);
    const [discountApplied, setDiscountApplied] = useState(false);

    // Read tier from AuthContext (already loaded on login, no extra query)
    const { profile } = useAuth();
    const tier = profile?.tier || 'bronze';

    // Read config from ConfigContext (shared, no extra query)
    const { config } = useConfig();

    // Calculate Price (Reacting to Context Changes)
    useEffect(() => {
        if (!basePrice || tier === 'bronze') {
            setFinalPrice(basePrice);
            setDiscountApplied(false);
            return;
        }

        // Access nested tier_discounts from context config
        const discounts = config.tier_discounts || {};
        const discountPercent = discounts[tier] || 0;

        if (discountPercent > 0) {
            const discountAmount = basePrice * discountPercent;
            const newPrice = basePrice - discountAmount;
            setFinalPrice(newPrice);
            setDiscountApplied(true);
        } else {
            setFinalPrice(basePrice);
            setDiscountApplied(false);
        }

    }, [basePrice, tier, config]);

    return {
        finalPrice,
        discountApplied,
        originalPrice: basePrice,
        tier
    };
};
