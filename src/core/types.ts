/**
 * Tipos e Interfaces do Jogo de Adivinhação de Palavras
 */

export type LetterEvaluation = 'correct' | 'present' | 'absent' | 'empty';

export type ThemeId = 'minimal-dark' | 'neo-arcade' | 'editorial-warm';

export interface TileState {
  letter: string;
  displayLetter?: string;
  status: LetterEvaluation;
}

export interface SecretWordEntry {
  word: string;
  displayWord: string;
  meaning: string;
  class?: string;
}

export interface UserStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessesDistribution: { [attempt: number]: number };
  lastCompletedDate?: string;
}

export interface ActiveGameSession {
  secretWord: SecretWordEntry;
  guesses: string[];
  currentAttempt: number;
  isCompleted: boolean;
  hasWon: boolean;
}

export interface UserPreferences {
  theme: ThemeId;
  colorblindMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
