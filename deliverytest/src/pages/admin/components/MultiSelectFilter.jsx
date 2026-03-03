import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutside';
import styles from '../AdminClients.module.css'; // Reusing page styles for consistency

const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
    // Simple Dropdown implementation with checkboxes
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside
    useClickOutside(wrapperRef, () => {
        setIsOpen(false);
    });

    const toggleOption = (value) => {
        let newValues;
        if (selectedValues.includes(value)) {
            newValues = selectedValues.filter(v => v !== value);
        } else {
            newValues = [...selectedValues, value];
        }
        onChange(newValues);
    };

    return (
        <div className={styles.filterDropdown} ref={wrapperRef}>
            <button className={styles.filterButton} onClick={() => setIsOpen(!isOpen)}>
                <span>{label} {selectedValues.length > 0 ? `(${selectedValues.length})` : ''}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.filterIcon} ${isOpen ? styles.filterIconOpen : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className={styles.filterMenu}>
                    {options.map(opt => (
                        <label key={opt.value} className={styles.filterOption}>
                            <input
                                type="checkbox"
                                checked={selectedValues?.includes(opt.value) || false}
                                onChange={() => toggleOption(opt.value)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectFilter;
