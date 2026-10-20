/**
 * Utilitários de normalização e processamento linguístico para Português do Brasil.
 */

/**
 * Normaliza uma palavra removendo acentos e cedilhas e convertendo para maiúsculas.
 * Exemplo: "ÍMPAR" -> "IMPAR", "MAÇÃ" -> "MACA", "sagaz" -> "SAGAZ"
 */
export function normalizeWord(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos diacríticos
    .replace(/Ç/gi, 'C')             // Normaliza cedilha
    .toUpperCase()
    .trim();
}

/**
 * Valida se a string contém exatamente 5 caracteres alfabéticos válidos (A-Z).
 */
export function isValidLetterPattern(input: string): boolean {
  return /^[A-Z]{5}$/.test(normalizeWord(input));
}
