import React, { useState, useEffect } from 'react';
import { getUserAddresses, createAddress } from '../../services/address';
import styles from './StepAddress.module.css';

const StepAddress = ({ onNext }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        zip_code: '', street: '', number: '', complement: '', district: '', city: '', state: ''
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setLoading(true);
        const data = await getUserAddresses();
        setAddresses(data);
        // Auto-select main or first
        if (data.length > 0) {
            const main = data.find(a => a.is_main);
            setSelectedId(main ? main.id : data[0].id);
        } else {
            setShowForm(true); // Force create if empty
        }
        setLoading(false);
    };

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const newAddr = await createAddress({
                ...formData,
                is_main: addresses.length === 0 // First one is main
            });
            await loadAddresses();
            setSelectedId(newAddr.id);
            setShowForm(false);
        } catch (error) {
            alert('Erro ao criar endereço: ' + error.message);
        }
    };

    const handleContinue = () => {
        if (!selectedId) return alert('Selecione um endereço');
        const selectedAddr = addresses.find(a => a.id === selectedId);
        onNext(selectedAddr);
    };

    if (loading) return <div>Carregando endereços...</div>;

    return (
        <div className={styles.container}>
            <h3>Onde vamos entregar?</h3>

            {!showForm ? (
                <>
                    <div className={styles.list}>
                        {addresses.map(addr => (
                            <div
                                key={addr.id}
                                className={`${styles.card} ${selectedId === addr.id ? styles.selected : ''}`}
                                onClick={() => handleSelect(addr.id)}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.street}>{addr.street}, {addr.number}</span>
                                    {addr.is_main && <span className={styles.badge}>Sede</span>}
                                </div>
                                <p className={styles.details}>{addr.district} - {addr.city}/{addr.state}</p>
                            </div>
                        ))}
                    </div>

                    <button className={styles.newButton} onClick={() => setShowForm(true)}>
                        + Adicionar Novo Endereço
                    </button>

                    <button className={styles.nextButton} onClick={handleContinue}>
                        Continuar para Pagamento
                    </button>
                </>
            ) : (
                <form onSubmit={handleCreate} className={styles.form}>
                    <h4>Novo Endereço</h4>
                    <input
                        placeholder="CEP"
                        value={formData.zip_code}
                        onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
                        required
                    />
                    <div className={styles.row}>
                        <input
                            placeholder="Rua"
                            value={formData.street}
                            onChange={e => setFormData({ ...formData, street: e.target.value })}
                            required style={{ flex: 2 }}
                        />
                        <input
                            placeholder="Número"
                            value={formData.number}
                            onChange={e => setFormData({ ...formData, number: e.target.value })}
                            required style={{ flex: 1 }}
                        />
                    </div>
                    <input
                        placeholder="Complemento"
                        value={formData.complement}
                        onChange={e => setFormData({ ...formData, complement: e.target.value })}
                    />
                    <input
                        placeholder="Bairro"
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        required
                    />
                    <div className={styles.row}>
                        <input
                            placeholder="Cidade"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                            required style={{ flex: 2 }}
                        />
                        <input
                            placeholder="UF"
                            value={formData.state}
                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                            required style={{ flex: 1 }}
                        />
                    </div>

                    <div className={styles.formActions}>
                        {addresses.length > 0 && (
                            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelButton}>
                                Cancelar
                            </button>
                        )}
                        <button type="submit" className={styles.saveButton}>Salvar Endereço</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default StepAddress;
