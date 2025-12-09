/**
 * Gera um CPF válido com dígitos verificadores corretos
 */
export function generateValidCpf(): string {
  const randomDigits = (): number[] => {
    const digits: number[] = [];
    for (let i = 0; i < 9; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    return digits;
  };

  const calculateDigit = (digits: number[], factor: number): number => {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (factor - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digits = randomDigits();
  const firstDigit = calculateDigit(digits, 10);
  digits.push(firstDigit);
  const secondDigit = calculateDigit(digits, 11);
  digits.push(secondDigit);

  return digits.join('');
}

/**
 * Formata CPF com pontuação (XXX.XXX.XXX-XX)
 */
export function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
