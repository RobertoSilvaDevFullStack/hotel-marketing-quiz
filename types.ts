
export type Shape = 'triangle' | 'diamond' | 'circle' | 'square';

export interface Option {
  id: string;
  text: string;
  shape: Shape;
  color: string;
  icon?: any; // Lucide React Icon component
  isCorrect?: boolean; // Optional, for this survey style quiz there might not be "correct" answers, but "opinions"
}

export interface Question {
  id: number;
  question: string;
  image?: string; // Placeholder or description
  options: Option[];
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  READING = 'READING', // Short pause to read question before timer starts
  ANSWERING = 'ANSWERING', // 20s
  BUFFER = 'BUFFER', // 10s "Calculating"
  RESULTS = 'RESULTS', // 20s Graph
  FINISHED = 'FINISHED'
}

export interface GameState {
  currentQuestionIndex: number;
  phase: GamePhase;
  timeLeft: number;
  answers: Record<string, number>; // optionId -> count
}

export interface TimerConfig {
  READING: number;
  ANSWERING: number;
  BUFFER: number;
  RESULTS: number;
}
