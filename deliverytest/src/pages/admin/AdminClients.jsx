import React, { useEffect, useState, useRef } from 'react';
import { getClients } from '../../services/clients';
import { formatCNPJ, formatPhone } from '../../utils/validation';
import ClientDetailsModal from './ClientDetailsModal';
import { useClickOutside } from '../../hooks/useClickOutside';
import MultiSelectFilter from './components/MultiSelectFilter';
import TierBadge from './components/TierBadge';
import styles from './AdminClients.module.css';

const TIER_OPTIONS = [
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Prata' },
    { value: 'gold', label: 'Ouro' }
];

const ROLE_OPTIONS = [
    { value: 'customer', label: 'Clientes' },
    { value: 'admin', label: 'Admins' },
    { value: 'super_admin', label: 'Super Admins' }
];

const AdminClients = () => {
    // Basic State
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    // Filter State
    const [filterTiers, setFilterTiers] = useState([]);
    const [filterRoles, setFilterRoles] = useState(['customer']); // Default: Only show customers

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 50;

    useEffect(() => {
        loadClients();
    }, [page, filterTiers, filterRoles]); // Reload when filters change

    // Debounce search
    useEffect(() => {
        setPage(1); // Reset to page 1 on new search
        const timer = setTimeout(() => {
            loadClients();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadClients = async () => {
        setLoading(true);
        try {
            // SANITIZATION: If search looks like CNPJ/Phone (digits + minimal punctuation), clean it.
            // If it has letters, keep it (could be name/email).
            let cleanSearch = searchTerm;
            if (searchTerm && !/[a-zA-Z]/.test(searchTerm)) {
                cleanSearch = searchTerm.replace(/\D/g, '');
            }

            const data = await getClients(page, PAGE_SIZE, cleanSearch, {
                tiers: filterTiers, // Pass array
                roles: filterRoles  // Pass array
            });
            setClients(data);

            if (data && data.length > 0) {
                const total = data[0].total_count;
                setTotalCount(total);
                setTotalPages(Math.ceil(total / PAGE_SIZE));
            } else {
                setTotalCount(0);
                setTotalPages(1);
            }

        } catch (error) {
            console.error('Failed to load clients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (client) => {
        setSelectedClient(client);
    };

    const handleCloseModal = () => {
        setSelectedClient(null);
    };

    const handleClientUpdated = (updatedClient) => {
        // Optimistic Update: Update list locally to avoid refetch/flicker
        setClients(prevClients => prevClients.map(client =>
            client.id === updatedClient.id
                ? { ...client, ...updatedClient }
                : client
        ));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gerenciar Clientes</h1>
                    <p className={styles.subtitle}>Consulte e altere níveis de fidelidade e cadastro.</p>
                </div>
            </div>

            <div className={styles.filterContainer}>
                <div className={styles.searchWrapper}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.searchIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className={styles.searchInput}
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.filterActions}>
                    <MultiSelectFilter
                        label="Todas as Categorias" // Using label from screenshot concept, though mapped to Tiers
                        options={TIER_OPTIONS}
                        selectedValues={filterTiers}
                        onChange={(newValues) => { setFilterTiers(newValues); setPage(1); }}
                    />

                    <MultiSelectFilter
                        label="Todos os Status" // Using label from screenshot concept, though mapped to Roles
                        options={ROLE_OPTIONS}
                        selectedValues={filterRoles}
                        onChange={(newValues) => { setFilterRoles(newValues); setPage(1); }}
                    />
                </div>
            </div>

            {loading ? (
                <div>Carregando clientes...</div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Empresa</th>
                                    <th>Email</th>
                                    <th>CNPJ</th>
                                    <th>Telefone</th>
                                    <th>Nível</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client.id}>
                                        <td>
                                            <strong>{client.company_name || 'Sem nome'}</strong>
                                            {client.role === 'admin' && <span className={styles.adminBadge}>Admin</span>}
                                            {client.role === 'super_admin' && <span className={styles.superAdminBadge}>Super Admin</span>}
                                        </td>
                                        <td className={styles.secondaryText}>{client.email || '-'}</td>
                                        <td className={styles.secondaryText}>{formatCNPJ(client.cnpj) || '-'}</td>
                                        <td className={styles.secondaryText}>{formatPhone(client.phone) || '-'}</td>
                                        <td>
                                            <TierBadge tier={client.tier} />
                                        </td>
                                        <td>
                                            <button className={styles.editBtn} onClick={() => handleEditClick(client)}>
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#666' }}>
                                            Nenhum cliente encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List */}
                    <div className={styles.mobileCards}>
                        {clients.map(client => (
                            <div key={client.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <strong>{client.company_name}</strong>
                                    <TierBadge tier={client.tier} />
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.cardLabel}>Email:</span>
                                    <span>{client.email}</span>
                                </div>
                                <div className={styles.cardRow}>
                                    <span className={styles.cardLabel}>CNPJ:</span>
                                    <span>{formatCNPJ(client.cnpj)}</span>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <button className={styles.editBtn} style={{ width: '100%' }} onClick={() => handleEditClick(client)}>
                                        Editar / Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                Anterior
                            </button>
                            <span className={styles.pageInfo}>
                                Página {page} de {totalPages} ({totalCount} registros)
                            </span>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                            >
                                Próximo
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedClient && (
                <ClientDetailsModal
                    client={selectedClient}
                    onClose={handleCloseModal}
                    onUpdate={handleClientUpdated}
                />
            )}
        </div>
    );
};

export default AdminClients;
