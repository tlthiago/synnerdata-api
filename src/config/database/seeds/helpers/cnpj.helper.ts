/**
 * Gera um CNPJ válido com dígitos verificadores corretos
 */
export function generateValidCnpj(): string {
  const randomDigits = (): number[] => {
    const digits: number[] = [];
    for (let i = 0; i < 8; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    // Filial (0001)
    digits.push(0, 0, 0, 1);
    return digits;
  };

  const calculateDigit = (digits: number[], weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digits = randomDigits();

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstDigit = calculateDigit(digits, weights1);
  digits.push(firstDigit);

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondDigit = calculateDigit(digits, weights2);
  digits.push(secondDigit);

  return digits.join('');
}

/**
 * Formata CNPJ com pontuação (XX.XXX.XXX/XXXX-XX)
 */
export function formatCnpj(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
