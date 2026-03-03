import React from 'react';
import styles from './CheckoutWizard.module.css';

const CheckoutWizard = ({ currentStep, children }) => {
    const steps = [
        { id: 1, name: 'Endereço' },
        { id: 2, name: 'Pagamento' },
        { id: 3, name: 'Revisão' },
        { id: 4, name: 'Sucesso' },
    ];

    return (
        <div className={styles.wizard}>
            <div className={styles.stepper}>
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
                            <div className={styles.circle}>
                                {isCompleted ? '✓' : step.id}
                            </div>
                            <span className={styles.label}>{step.name}</span>
                            {step.id !== steps.length && <div className={styles.line} />}
                        </div>
                    );
                })}
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default CheckoutWizard;
