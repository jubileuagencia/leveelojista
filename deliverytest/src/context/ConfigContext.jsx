import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getAppConfig, subscribeToConfigChanges } from '../services/config';

const ConfigContext = createContext();

export const useConfig = () => {
    return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
    // Default values
    const [config, setConfig] = useState({
        tier_discounts: { silver: 0.04, gold: 0.08 }
    });

    const [loading, setLoading] = useState(true);

    const loadConfig = useCallback(async () => {
        try {
            const discounts = await getAppConfig('tier_discounts');
            if (discounts) {

                setConfig(prev => ({ ...prev, tier_discounts: discounts }));
            }
        } catch (error) {
            console.error("Config fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // 1. Initial Fetch
        loadConfig();

        // 2. Realtime Subscription (updates pushed from Supabase when config changes)
        const subscription = subscribeToConfigChanges('tier_discounts', (newDiscounts) => {
            setConfig(prev => ({ ...prev, tier_discounts: newDiscounts }));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadConfig]);

    const value = useMemo(() => ({
        config,
        loading,
        refreshConfig: loadConfig // Expose reload capability
    }), [config, loading, loadConfig]);

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};
