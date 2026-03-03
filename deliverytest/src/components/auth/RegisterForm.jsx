
import React, { useState } from 'react';
import styles from './AuthForm.module.css'; // Reusing AuthForm styles for consistency
import { isValidCNPJ } from '../../utils/validators';
import { formatCNPJ, formatPhone, formatCEP, cleanDigits } from '../../utils/masks';
import { registerUser } from '../../services/auth';

const RegisterForm = ({ onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Basic Info, 2: Address
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: '',
        cnpj: '',
        phone: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isMain: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Apply masks
        if (name === 'cnpj') finalValue = formatCNPJ(value);
        if (name === 'phone') finalValue = formatPhone(value);
        if (name === 'cep') finalValue = formatCEP(value);

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleBlurCEP = async () => {
        const cleanCep = cleanDigits(formData.cep);
        if (cleanCep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    }));
                }
            } catch (err) {
                console.error("CEP error", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation Step 1
        if (step === 1) {
            if (!formData.companyName || !formData.email || !formData.password || !formData.cnpj || !formData.phone) {
                setError("Por favor, preencha todos os campos obrigatórios.");
                return;
            }
            if (!isValidCNPJ(formData.cnpj)) {
                setError("CNPJ inválido.");
                return;
            }
            setStep(2);
            return;
        }

        // Final Submission
        setLoading(true);

        try {
            // Prepared Metadata for Trigger
            const metadata = {
                company_name: formData.companyName,
                cnpj: cleanDigits(formData.cnpj),
                phone: cleanDigits(formData.phone),
                address: {
                    cep: cleanDigits(formData.cep),
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    neighborhood: formData.neighborhood,
                    city: formData.city,
                    state: formData.state,
                    is_main: formData.isMain
                }
            };

            // 1. Create Auth User with Metadata
            // The DB Trigger 'handle_new_user' will automatically create Profile and Address
            // 1. Create Auth User with Metadata
            // The DB Trigger 'handle_new_user' will automatically create Profile and Address
            const user = await registerUser({
                email: formData.email,
                password: formData.password,
                metadata
            });

            if (!user) throw new Error("Erro ao criar usuário.");

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>
                {step === 1 ? 'Cadastro Lojista' : 'Endereço da Sede'}
            </h2>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>

                {step === 1 && (
                    <>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Razão Social / Nome Fantasia</label>
                            <input
                                className={styles.input}
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Minha Loja LTDA"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>CNPJ</label>
                            <input
                                className={styles.input}
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                placeholder="00.000.000/0000-00"
                                maxLength={18}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Telefone / WhatsApp</label>
                            <input
                                className={styles.input}
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(11) 99999-9999"
                                maxLength={15}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>E-mail</label>
                            <input
                                className={styles.input}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="financeiro@loja.com"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Senha</label>
                            <input
                                className={styles.input}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="******"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Continuar &rarr;
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>CEP</label>
                            <input
                                className={styles.input}
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                onBlur={handleBlurCEP}
                                placeholder="00000-000"
                                maxLength={9}
                            />
                        </div>

                        <div className={styles.streetGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Rua</label>
                                <input
                                    className={styles.input}
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Número</label>
                                <input
                                    className={styles.input}
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Complemento</label>
                            <input
                                className={styles.input}
                                name="complement"
                                value={formData.complement}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Bairro</label>
                            <input
                                className={styles.input}
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.cityGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Cidade</label>
                                <input
                                    className={styles.input}
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>UF</label>
                                <input
                                    className={styles.input}
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                checked={formData.isMain}
                                onChange={(e) => setFormData(prev => ({ ...prev, isMain: e.target.checked }))}
                            />
                            <span className={styles.label} style={{ marginBottom: 0 }}>Esta é a sede principal?</span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className={styles.switchButton}
                                style={{ flex: 1, textDecoration: 'none', border: '1px solid currentColor', borderRadius: '8px' }}
                            >
                                Voltar
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                                style={{ marginTop: 0, flex: 2 }}
                            >
                                {loading ? 'Criando...' : 'Finalizar Cadastro'}
                            </button>
                        </div>
                    </>
                )}

            </form>
        </div>
    );
};

export default RegisterForm;
