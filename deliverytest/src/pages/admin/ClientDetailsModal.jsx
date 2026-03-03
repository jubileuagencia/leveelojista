import React, { useState, useEffect } from 'react';
import { updateClientProfile, getClientDetails, addClientAddress, updateClientAddress, deleteClientAddress } from '../../services/clients';
import { validateCNPJ, formatCNPJ, formatPhone } from '../../utils/validation';
import TierBadge from './components/TierBadge';
import styles from './ClientDetailsModal.module.css';

const TIER_OPTIONS = [
    { value: 'bronze', label: 'Bronze', color: 'bronze' },
    { value: 'silver', label: 'Prata', color: 'silver' },
    { value: 'gold', label: 'Ouro', color: 'gold' },
];

const ClientDetailsModal = ({ client, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('general'); // general | addresses
    const [loading, setLoading] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    // Fetch current user role on mount
    useEffect(() => {
        const fetchRole = async () => {
            const { data: { user } } = await import('../../lib/supabase').then(m => m.supabase.auth.getUser());
            if (user) {
                const { data } = await import('../../lib/supabase').then(m => m.supabase.from('profiles').select('role').eq('id', user.id).single());
                if (data) setCurrentUserRole(data.role);
            }
        };
        fetchRole();
    }, []);
    const [formData, setFormData] = useState({
        company_name: '',
        cnpj: '',
        phone: '',
        tier: 'bronze',
        role: 'customer'
    });

    // Address State
    // Address State
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null); // null = list mode, {} = create, {id...} = edit
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client) {
            // Initial placeholder from props (fast render)
            setFormData({
                company_name: client.company_name || '',
                cnpj: client.cnpj || '',
                phone: client.phone || '',
                tier: client.tier || 'bronze',
                role: client.role || 'customer',
                email: client.email || '' // Init from props
            });
            // Fetch FRESH data from DB (reliability)
            loadClientData();
        }
    }, [client]);

    const loadClientData = async () => {
        try {
            setLoading(true);
            const details = await getClientDetails(client.id);
            setAddresses(details.addresses || []);

            // Update form with fresh data (if changed by another admin)
            if (details) {
                setFormData(prev => ({
                    ...prev,
                    company_name: details.company_name || prev.company_name,
                    cnpj: details.cnpj || prev.cnpj,
                    phone: details.phone || prev.phone,
                    tier: details.tier || prev.tier,
                    role: details.role || prev.role
                    // Email not in details, keep existing
                }));
            }
        } catch (error) {
            console.error("Failed to load freshly client data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'cnpj' && value) {
            if (!validateCNPJ(value)) {
                setErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido' }));
            }
        }
    };

    const [statusMessage, setStatusMessage] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID of address pending deletion

    // Auto-clear status after 3 seconds
    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => setStatusMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
    };

    const handleSaveGeneral = async () => {
        // Validate CNPJ
        if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
            showStatus('error', 'CNPJ Inválido. Por favor, verifique o número.');
            return;
        }

        setLoading(true);
        setStatusMessage(null);
        try {
            // DATA HYGIENE: Clean formatting before sending to DB
            const cleanData = {
                ...formData,
                cnpj: formData.cnpj.replace(/\D/g, ''),
                phone: formData.phone.replace(/\D/g, '')
            };

            // 1. Update Profile (Standard Data)
            const updatedProfile = await updateClientProfile(client.id, cleanData);

            // 2. Update Email (If changed)
            // Note: client.email comes from props (list view). 
            // If user somehow edited it, we check against initial prop.
            let updatedEmail = client.email;
            if (formData.email !== client.email) {
                // Import dynamically to avoid circular deps if any (though services are pure)
                const { updateClientEmail } = await import('../../services/clients');
                await updateClientEmail(client.id, formData.email);
                updatedEmail = formData.email;
            }

            // 3. Return combined data to parent
            onUpdate({ ...updatedProfile, email: updatedEmail });
            showStatus('success', 'Perfil atualizado com sucesso!');
            setTimeout(() => onClose(), 1000); // Close after success msg
        } catch (error) {
            showStatus('error', 'Erro ao atualizar: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = async (addressData) => {
        setLoading(true);
        setStatusMessage(null);
        try {
            if (addressData.id) {
                await updateClientAddress(addressData.id, addressData);
            } else {
                await addClientAddress({ ...addressData, user_id: client.id });
            }
            await loadClientData(); // Reload list
            setEditingAddress(null); // Return to list view
            showStatus('success', 'Endereço salvo com sucesso!');
        } catch (error) {
            showStatus('error', 'Erro ao salvar: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (confirmDeleteId === id) {
            // Confirmed
            setLoading(true);
            setStatusMessage(null);
            try {
                await deleteClientAddress(id);
                await loadClientData();
                showStatus('success', 'Endereço excluído.');
            } catch (error) {
                showStatus('error', 'Erro ao excluir: ' + error.message);
            } finally {
                setLoading(false);
                setConfirmDeleteId(null);
            }
        } else {
            // First click - Ask confirmation
            setConfirmDeleteId(id);
            // Auto-cancel confirmation after 3s
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Editar Cliente</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        Dados Gerais
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'addresses' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('addresses')}
                    >
                        Endereços ({addresses.length})
                    </button>
                </div>

                <div className={styles.content}>
                    {statusMessage && (
                        <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {activeTab === 'general' ? (
                        <GeneralForm
                            formData={formData}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={errors}
                            loading={loading}
                            currentUserRole={currentUserRole}
                            originalTier={client.tier} // Passaing original tier
                        />
                    ) : (
                        <AddressManager
                            addresses={addresses}
                            editingAddress={editingAddress}
                            setEditingAddress={setEditingAddress}
                            onSave={handleSaveAddress}
                            onDelete={handleDeleteAddress}
                            confirmDeleteId={confirmDeleteId} // Pass ID
                            loading={loading}
                        />
                    )}
                </div>

                {activeTab === 'general' && (
                    <div className={styles.footer}>
                        <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={onClose}>Cancelar</button>
                        <button
                            className={`${styles.btn} ${styles.saveBtn}`}
                            onClick={handleSaveGeneral}
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-components for cleaner code
const GeneralForm = ({ formData, onChange, onBlur, errors, loading, currentUserRole, originalTier }) => {

    const canEditRole = () => {
        if (!currentUserRole) return false;
        if (currentUserRole === 'super_admin') return true;
        // Admin can only edit 'customer' roles
        // If the target is ALREADY admin or super_admin, regular admin cannot touch it
        return formData.role !== 'admin' && formData.role !== 'super_admin';
    };

    return (
        <>
            <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Nível de Fidelidade (Tier)
                    {originalTier && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>
                            (Atual: <TierBadge tier={originalTier} />)
                        </span>
                    )}
                </label>
                <div className={styles.tierOptions}>
                    {TIER_OPTIONS.map(tier => (
                        <label
                            key={tier.value}
                            className={`${styles.tierLabel} ${styles[tier.color]}`}
                            style={{
                                backgroundColor: formData.tier === tier.value ? 'var(--primary-color)' : 'transparent',
                                borderColor: formData.tier === tier.value ? 'var(--primary-color)' : '',
                                color: formData.tier === tier.value ? 'white' : ''
                            }}
                        >
                            <input
                                type="radio"
                                name="tier"
                                value={tier.value}
                                checked={formData.tier === tier.value}
                                onChange={onChange}
                                className={styles.tierInput}
                            />
                            {tier.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label>Nome da Empresa</label>
                <input
                    type="text"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={onChange}
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Email (Login)</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={onChange}
                    className={styles.input}
                    placeholder="email@exemplo.com"
                />
            </div>

            <div className={styles.formGroup}>
                <label>CNPJ</label>
                <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj || ''}
                    onChange={(e) => onChange({ target: { name: 'cnpj', value: formatCNPJ(e.target.value) } })}
                    onBlur={onBlur} // Added onBlur
                    maxLength={18}
                    className={`${styles.input} ${errors?.cnpj ? styles.inputError : ''}`}
                />
                {errors?.cnpj && <span className={styles.errorMessage}>{errors.cnpj}</span>}
            </div>

            <div className={styles.formGroup}>
                <label>Telefone</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={(e) => onChange({ target: { name: 'phone', value: formatPhone(e.target.value) } })}
                    maxLength={15}
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Função (Apenas Admins podem alterar)</label>
                <select
                    name="role"
                    value={formData.role || 'customer'}
                    onChange={onChange}
                    className={styles.select}
                    disabled={!canEditRole()}
                >
                    <option value="customer">Cliente</option>
                    <option value="admin">Administrador</option>
                    <option value="super_admin" disabled>Super Administrador (Sistema)</option>
                </select>
                <small style={{ color: '#999', fontSize: '0.8rem' }}>Para promover a Admin, contate o suporte.</small>
            </div>
        </>
    );
};

const AddressManager = ({ addresses, editingAddress, setEditingAddress, onSave, onDelete, confirmDeleteId, loading }) => {
    // Local state for address form
    const [form, setForm] = useState({});

    useEffect(() => {
        if (editingAddress) {
            setForm(editingAddress.id ? editingAddress : {
                zip_code: '', street: '', number: '', district: '', city: '', state: '', is_main: false
            });
        }
    }, [editingAddress]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // BUG FIX: Spread the PREVIOUS state correctly so other fields are not lost/undefined
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (editingAddress) {
        return (
            <div className={styles.addressForm}>
                <h3>{form.id ? 'Editar Endereço' : 'Novo Endereço'}</h3>
                <div className={styles.formGroup}>
                    <label>CEP</label>
                    <input name="zip_code" value={form.zip_code || ''} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label>Rua</label>
                    <input name="street" value={form.street || ''} onChange={handleChange} className={styles.input} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Número</label>
                        <input name="number" value={form.number || ''} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 2 }}>
                        <label>Bairro</label>
                        <input name="district" value={form.district || ''} onChange={handleChange} className={styles.input} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div className={styles.formGroup} style={{ flex: 3 }}>
                        <label>Cidade</label>
                        <input name="city" value={form.city || ''} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>UF</label>
                        <input name="state" value={form.state || ''} onChange={handleChange} className={styles.input} />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <input type="checkbox" name="is_main" checked={form.is_main || false} onChange={handleChange} />
                        {' '}Endereço Principal?
                    </label>
                </div>

                <div className={styles.footer}>
                    <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={() => setEditingAddress(null)}>Voltar</button>
                    <button className={`${styles.btn} ${styles.saveBtn}`} onClick={() => onSave(form)} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Endereço'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.addressList}>
            {addresses.map(addr => (
                <div key={addr.id} className={styles.addressCard}>
                    <div className={styles.addressHeader}>
                        <strong>{addr.street}, {addr.number}</strong>
                        {addr.is_main && <span className={styles.mainBadge}>Principal</span>}
                    </div>
                    <div>{addr.district} - {addr.city}/{addr.state}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>CEP: {addr.zip_code}</div>

                    <div className={styles.addressActions}>
                        <button className={styles.actionLink} onClick={() => setEditingAddress(addr)}>Editar</button>
                        <button
                            className={`${styles.actionLink} ${styles.deleteLink} ${confirmDeleteId === addr.id ? styles.confirmDelete : ''}`}
                            onClick={() => onDelete(addr.id)}
                        >
                            {confirmDeleteId === addr.id ? 'Confirmar?' : 'Excluir'}
                        </button>
                    </div>
                </div>
            ))}

            <button className={styles.addAddressBtn} onClick={() => setEditingAddress({})}>
                + Adicionar Novo Endereço
            </button>
        </div>
    );
};

export default ClientDetailsModal;
