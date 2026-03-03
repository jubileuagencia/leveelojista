/**
 * Validates a CNPJ number (Brazilian Business Tax ID).
 * @param {string} cnpj - The CNPJ string to validate (can include punctuation).
 * @returns {boolean} - True if valid, false otherwise.
 */
export const validateCNPJ = (cnpj) => {
    if (!cnpj) return false;

    // Remove non-digits
    const numbers = cnpj.replace(/[^\d]/g, '');

    // Check length
    if (numbers.length !== 14) return false;

    // Reject known invalid patterns (e.g. 00000000000000)
    if (/^(\d)\1+$/.test(numbers)) return false;

    // Validate 1st digit
    let size = numbers.length - 2;
    let nums = numbers.substring(0, size);
    let digits = numbers.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += nums.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != digits.charAt(0)) return false;

    // Validate 2nd digit
    size = size + 1;
    nums = numbers.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += nums.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != digits.charAt(1)) return false;

    return true;
};

/**
 * Formats a string into CNPJ pattern (00.000.000/0000-00).
 * @param {string} value 
 * @returns {string} Formatted CNPJ
 */
export const formatCNPJ = (value) => {
    const v = value.replace(/\D/g, '').substring(0, 14);
    return v
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

/**
 * Formats a string into Phone pattern with 10 or 11 digits.
 * (XX) 0000-0000 or (XX) 00000-0000
 */
export const formatPhone = (value) => {
    if (!value) return '';
    const v = value.replace(/\D/g, '').substring(0, 11);

    if (v.length > 10) {
        return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
    return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
};
