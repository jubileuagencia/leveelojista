
export const isValidCNPJ = (cnpj) => {
    if (!cnpj) return false;

    const match = cnpj.toString().match(/\d/g);
    const numbers = match?.map(Number);

    if (numbers?.length !== 14) return false;

    const items = [...new Set(numbers)];
    if (items.length === 1) return false;

    // Validate first digit
    const calc = (x) => {
        const slice = numbers.slice(0, x);
        let factor = x - 7;
        let sum = 0;

        for (let i = x; i >= 1; i--) {
            const n = slice[x - i];
            sum += n * factor--;
            if (factor < 2) factor = 9;
        }

        const result = 11 - (sum % 11);
        return result > 9 ? 0 : result;
    };

    const digit0 = calc(12);
    const digit1 = calc(13);

    return digit0 === numbers[12] && digit1 === numbers[13];
};

export const isValidCPF = (cpf) => {
    if (!cpf) return false;
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1+$/.test(digits)) return false; // Repeated digits

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum += parseInt(digits.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(digits.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits.substring(10, 11))) return false;

    return true;
};
