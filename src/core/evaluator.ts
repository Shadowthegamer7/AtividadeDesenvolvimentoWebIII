import { LetterEvaluation } from './types';

/**
 * Avalia um palpite em relação à palavra secreta utilizando o algoritmo canônico
 * em duas passadas para garantir precisão com letras repetidas.
 *
 * @param guess Palpite de 5 letras (já normalizado)
 * @param secret Palavra secreta de 5 letras (já normalizada)
 * @returns Array de 5 estados: 'correct' | 'present' | 'absent'
 */
export function evaluateGuess(guess: string, secret: string): LetterEvaluation[] {
  if (guess.length !== 5 || secret.length !== 5) {
    throw new Error('Tanto o palpite quanto a palavra secreta devem conter exatamente 5 letras.');
  }

  const result: LetterEvaluation[] = new Array(5).fill('absent');
  const secretChars = secret.split('');
  const guessChars = guess.split('');

  // 1. Contagem de frequência de caracteres disponíveis na palavra secreta
  const letterCounts: { [char: string]: number } = {};
  for (const char of secretChars) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // 2. Primeira Passada: Identificar todas as posições EXATAS (Verdes / 'correct')
  // As posições corretas têm precedência e consom primeiro as letras disponíveis
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === secretChars[i]) {
      result[i] = 'correct';
      letterCounts[guessChars[i]]--;
    }
  }

  // 3. Segunda Passada: Identificar letras DESLOCADAS (Amarelas / 'present')
  // Apenas marca como 'present' se ainda houver ocorrências não consumidas
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'correct') {
      const char = guessChars[i];
      if (letterCounts[char] && letterCounts[char] > 0) {
        result[i] = 'present';
        letterCounts[char]--;
      } else {
        result[i] = 'absent';
      }
    }
  }

  return result;
}
