import { GameState, TimerConfig } from "../types";
import { TIMERS as DEFAULT_TIMERS } from "../constants";

const GAME_STATE_KEY = "hotelQuiz_gameState";
const TIMER_CONFIG_KEY = "hotelQuiz_timerConfig";

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving game state:", error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading game state:", error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error("Error clearing game state:", error);
  }
};

export const saveTimerConfig = (config: TimerConfig): void => {
  try {
    localStorage.setItem(TIMER_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving timer config:", error);
  }
};

export const loadTimerConfig = (): TimerConfig | null => {
  try {
    const saved = localStorage.getItem(TIMER_CONFIG_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_TIMERS;
  } catch (error) {
    console.error("Error loading timer config:", error);
    return DEFAULT_TIMERS;
  }
};
