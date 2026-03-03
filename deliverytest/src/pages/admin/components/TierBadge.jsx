import React from 'react';
import styles from '../AdminClients.module.css'; // Reusing page styles for consistency

const TierBadge = ({ tier }) => {
    const safeTier = tier || 'bronze';
    // Translate?
    const labels = { bronze: 'Bronze', silver: 'Prata', gold: 'Ouro' };
    return (
        <span className={`${styles.tierBadge} ${styles[safeTier]}`}>
            ● {labels[safeTier] || safeTier}
        </span>
    );
};

export default TierBadge;
