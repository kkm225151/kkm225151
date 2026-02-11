
export type NoteState = 'none' | 'correct' | 'wrong';
export type GameMode = 'ai' | 'local' | null;

export interface GameRecord {
  id: string;
  guess: string;
  correctCount: number;
  notes: NoteState[];
}

export interface GameState {
  mySecret: string;
  gameMode: GameMode;
  isSecretVisible: boolean;
  history: GameRecord[];
  isGameStarted: boolean;
}
