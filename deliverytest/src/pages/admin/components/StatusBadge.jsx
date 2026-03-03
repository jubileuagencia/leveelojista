import React from 'react';

// Centralized status definition mapping
export const STATUS_CONFIG = {
    pending: { label: 'Novo', color: '#92400e', bg: '#fef3c7' }, // Amber (Novo)
    approved: { label: 'Aprovado', color: '#065f46', bg: '#d1fae5' }, // Green (Pago/Aprovado)
    preparing: { label: 'Em Separação', color: '#1e3a8a', bg: '#dbeafe' }, // Blue
    shipped: { label: 'Enviado', color: '#5b21b6', bg: '#ede9fe' }, // Purple
    delivered: { label: 'Entregue', color: '#065f46', bg: '#a7f3d0' }, // Stronger Green
    cancelled: { label: 'Cancelado', color: '#991b1b', bg: '#fee2e2' }, // Red
    rejected: { label: 'Rejeitado', color: '#991b1b', bg: '#fee2e2' }, // Red
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || { label: status || 'Desconhecido', color: '#374151', bg: '#f3f4f6' };

    return (
        <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: config.color,
            backgroundColor: config.bg,
            whiteSpace: 'nowrap',
            border: `1px solid ${config.color}33`, // slightly transparent border matching text color
            textTransform: 'uppercase'
        }}>
            {config.label}
        </span>
    );
};

export default StatusBadge;
