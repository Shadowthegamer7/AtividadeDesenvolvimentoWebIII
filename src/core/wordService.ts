import { SecretWordEntry } from './types';
import { CURATED_WORDS, VALID_GUESSES_LIST } from '../data/words';
import { normalizeWord } from './normalizer';

export class WordService {
  private static validGuessesSet: Set<string> = new Set(
    [...CURATED_WORDS.map(w => w.word), ...VALID_GUESSES_LIST.map(w => normalizeWord(w))]
      .filter(w => w.length === 5)
  );

  /**
   * Retorna uma palavra secreta aleatória da lista curada.
   */
  public static getRandomSecretWord(excludedIndices: number[] = []): { entry: SecretWordEntry; index: number } {
    const availableIndices = CURATED_WORDS
      .map((_, i) => i)
      .filter(i => !excludedIndices.includes(i));

    const pool = availableIndices.length > 0 ? availableIndices : CURATED_WORDS.map((_, i) => i);
    const chosenIndex = pool[Math.floor(Math.random() * pool.length)];

    return {
      entry: CURATED_WORDS[chosenIndex],
      index: chosenIndex
    };
  }

  /**
   * Obtém a entrada da palavra por índice específico.
   */
  public static getWordByIndex(index: number): SecretWordEntry {
    const safeIndex = (index >= 0 && index < CURATED_WORDS.length) ? index : 0;
    return CURATED_WORDS[safeIndex];
  }

  /**
   * Valida se uma palavra de 5 letras pertence ao léxico de palpites aceitos.
   */
  public static isValidGuess(guess: string): boolean {
    const normalized = normalizeWord(guess);
    if (normalized.length !== 5) return false;
    return this.validGuessesSet.has(normalized);
  }
}
