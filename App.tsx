import React, { useState, useEffect, useCallback, useRef } from "react";
import { GamePhase, GameState, TimerConfig } from "./types";
import { QUIZ_DATA, TIMERS as DEFAULT_TIMERS } from "./constants";
import { HostView } from "./views/HostView";
import { PlayerView } from "./views/PlayerView";
import {
  Monitor,
  Smartphone,
  Play,
  Settings as SettingsIcon,
} from "lucide-react";
import { initAudio, playSound } from "./utils/sound";
import { SettingsMenu } from "./components/SettingsMenu";
import {
  saveGameState,
  loadGameState,
  clearGameState,
  saveTimerConfig,
  loadTimerConfig,
} from "./utils/storage";
import { exportToCSV } from "./utils/export";
import { io, Socket } from "socket.io-client";

const App: React.FC = () => {
  // --- Game Configuration State ---
  const [timerConfig, setTimerConfig] = useState<TimerConfig>(
    loadTimerConfig() || DEFAULT_TIMERS
  );
  const [showLobbySettings, setShowLobbySettings] = useState(false);

  // --- Game State ---
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    phase: GamePhase.LOBBY,
    timeLeft: 0,
    answers: {},
  });

  // --- Local User State ---
  const [viewMode, setViewMode] = useState<"intro" | "host" | "player">(
    "intro"
  );
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket Connection
  useEffect(() => {
    // Connect to the server (relative path works for deployment)
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Both Host and Player listen for state syncs (Player relies on this)
    socket.on("state_sync", (serverState: any) => {
      if (viewMode === "player") {
        setGameState((prev) => ({
          ...prev,
          phase: serverState.phase,
          currentQuestionIndex: serverState.questionIndex,
          timeLeft: serverState.timeLeft,
          // Player doesn't need 'answers' usually
        }));
      }
    });

    // Only Host listens for new votes
    socket.on("host_votes_update", (updatedVotes: Record<string, number>) => {
      if (viewMode === "host") {
        setGameState((prev) => ({
          ...prev,
          answers: updatedVotes,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [viewMode]);

  // --- HOST ONLY: Game Loop Logic ---
  // The Host acts as the source of truth for time and phase logic

  const startGame = () => {
    initAudio();
    playSound("start");

    // Start fresh
    clearGameState();
    socketRef.current?.emit("host_start_game");

    const newState = {
      ...gameState,
      phase: GamePhase.READING,
      timeLeft: timerConfig.READING,
      answers: {},
    };
    setGameState(newState);
    broadcastState(newState);
  };

  const broadcastState = (state: GameState) => {
    if (viewMode === "host" && socketRef.current) {
      socketRef.current.emit("host_update_state", {
        phase: state.phase,
        questionIndex: state.currentQuestionIndex,
        timeLeft: state.timeLeft,
      });
      saveGameState(state); // Persist locally for host safety
    }
  };

  const nextQuestion = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex >= QUIZ_DATA.length) {
        const finishedState = {
          ...prev,
          phase: GamePhase.FINISHED,
          timeLeft: 0,
        };
        broadcastState(finishedState);
        return finishedState;
      }

      const nextState = {
        ...prev,
        currentQuestionIndex: nextIndex,
        phase: GamePhase.READING,
        timeLeft: timerConfig.READING,
        answers: {}, // Reset votes for next question locally
      };
      broadcastState(nextState);
      return nextState;
    });
  }, [timerConfig.READING, viewMode]);

  // Host Timer Logic
  useEffect(() => {
    // Only the Host runs the timer logic
    if (viewMode !== "host") return;
    if (
      gameState.phase === GamePhase.LOBBY ||
      gameState.phase === GamePhase.FINISHED
    )
      return;

    if (gameState.timeLeft <= 0) {
      // Phase Transitions
      if (gameState.phase === GamePhase.READING) {
        const newState = {
          ...gameState,
          phase: GamePhase.ANSWERING,
          timeLeft: timerConfig.ANSWERING,
        };
        setGameState(newState);
        broadcastState(newState);
      } else if (gameState.phase === GamePhase.ANSWERING) {
        const newState = {
          ...gameState,
          phase: GamePhase.BUFFER,
          timeLeft: timerConfig.BUFFER,
        };
        setGameState(newState);
        broadcastState(newState);
      } else if (gameState.phase === GamePhase.BUFFER) {
        const newState = {
          ...gameState,
          phase: GamePhase.RESULTS,
          timeLeft: timerConfig.RESULTS,
        };
        setGameState(newState);
        broadcastState(newState);
      } else if (gameState.phase === GamePhase.RESULTS) {
        nextQuestion();
      }
      return;
    }

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newState = { ...prev, timeLeft: prev.timeLeft - 1 };
        // Optional: Broadcast time every second?
        // Can be bandwidth heavy.
        // Better strategy: Broadcast once on phase change, and maybe sync every 5s if needed.
        // For this demo, we rely on phase change sync, but let's sync every 5s to keep players aligned
        if (newState.timeLeft % 5 === 0) {
          broadcastState(newState);
        }
        return newState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    gameState.timeLeft,
    gameState.phase,
    nextQuestion,
    timerConfig,
    viewMode,
  ]);

  // Request votes from database when entering READING phase (for Host)
  useEffect(() => {
    if (
      viewMode === "host" &&
      gameState.phase === GamePhase.READING &&
      socketRef.current
    ) {
      const currentQuestion = QUIZ_DATA[gameState.currentQuestionIndex];
      // Request existing votes for this question from server/database
      socketRef.current.emit("host_request_votes", {
        questionId: currentQuestion.id,
      });
    }
  }, [gameState.phase, gameState.currentQuestionIndex, viewMode]);

  // Restore State on Load (Host Only)
  useEffect(() => {
    if (viewMode === "host") {
      const saved = loadGameState();
      if (
        saved &&
        saved.phase !== GamePhase.LOBBY &&
        saved.phase !== GamePhase.FINISHED
      ) {
        setGameState(saved);
      }
    }
  }, [viewMode]);

  // Update Config Helper
  const handleUpdateTimers = (newConfig: TimerConfig) => {
    setTimerConfig(newConfig);
    saveTimerConfig(newConfig);
  };

  // Sound effect for Game Finished
  useEffect(() => {
    if (gameState.phase === GamePhase.FINISHED) {
      playSound("finish");
    }
  }, [gameState.phase]);

  // --- Render ---

  if (viewMode === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center tracking-tight">
          Hotel Marketing Quiz
        </h1>
        <p className="mb-12 text-xl text-purple-200 max-w-md text-center">
          Selecione o modo de visualização. Em um evento real, o Host estaria no
          telão e os participantes nos celulares.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <button
            onClick={() => setViewMode("host")}
            className="group relative bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-2xl p-8 flex flex-col items-center transition-all hover:scale-105"
          >
            <Monitor className="w-16 h-16 mb-4 text-cyan-400 group-hover:text-cyan-300" />
            <h2 className="text-2xl font-bold">Modo Apresentador (Host)</h2>
            <p className="mt-2 text-sm text-gray-300 text-center">
              Para o telão. Controla o tempo e mostra os gráficos.
            </p>
          </button>

          <button
            onClick={() => setViewMode("player")}
            className="group relative bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-2xl p-8 flex flex-col items-center transition-all hover:scale-105"
          >
            <Smartphone className="w-16 h-16 mb-4 text-green-400 group-hover:text-green-300" />
            <h2 className="text-2xl font-bold">Modo Participante</h2>
            <p className="mt-2 text-sm text-gray-300 text-center">
              Para o celular. Vota nas opções coloridas.
            </p>
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_DATA[gameState.currentQuestionIndex];

  if (viewMode === "host") {
    return (
      <div className="relative">
        {gameState.phase === GamePhase.LOBBY ? (
          <div className="h-screen bg-purple-900 flex flex-col items-center justify-center text-white relative">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => {
                  setShowLobbySettings(!showLobbySettings);
                  playSound("click");
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <SettingsIcon className="w-6 h-6" />
              </button>
              {showLobbySettings && (
                <SettingsMenu
                  config={timerConfig}
                  onSave={(newConfig) => {
                    handleUpdateTimers(newConfig);
                    setShowLobbySettings(false);
                    playSound("click");
                  }}
                  onClose={() => setShowLobbySettings(false)}
                />
              )}
            </div>

            <h1 className="text-6xl font-black mb-8">Quiz de Marketing</h1>
            <div className="bg-white p-4 rounded-xl shadow-lg qr-placeholder mb-8">
              {/* Generate QR pointing to current URL */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.href}`}
                alt="Join QR"
                className="w-64 h-64"
              />
            </div>
            <p className="text-2xl mb-8">Escaneie para entrar!</p>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-xl transition-transform transform hover:scale-105 flex items-center gap-3"
            >
              <Play fill="currentColor" /> Iniciar Quiz
            </button>
          </div>
        ) : gameState.phase === GamePhase.FINISHED ? (
          <div className="h-screen bg-purple-900 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black mb-4">Fim do Quiz!</h1>
            <div className="flex gap-4">
              {/* CSV Export button hidden per user request */}
              {false && (
                <button
                  onClick={() => {
                    exportToCSV(gameState.answers, QUIZ_DATA);
                    playSound("click");
                  }}
                  className="bg-blue-500 hover:bg-600 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Baixar Relatório (CSV)
                </button>
              )}
              <button
                onClick={() => {
                  clearGameState();
                  window.location.reload();
                }}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Reiniciar
              </button>
            </div>
          </div>
        ) : (
          <HostView
            question={currentQuestion}
            phase={gameState.phase}
            timeLeft={gameState.timeLeft}
            answers={gameState.answers}
            totalQuestions={QUIZ_DATA.length}
            currentQuestionIndex={gameState.currentQuestionIndex}
            timerConfig={timerConfig}
            onUpdateTimers={handleUpdateTimers}
            onBackToMenu={() => {
              clearGameState();
              setGameState({
                currentQuestionIndex: 0,
                phase: GamePhase.LOBBY,
                timeLeft: 0,
                answers: {},
              });
              setViewMode("intro");
            }}
          />
        )}

        {/* Back to menu button removed - now in settings menu */}
      </div>
    );
  }

  if (viewMode === "player") {
    return (
      <div className="relative">
        {gameState.phase === GamePhase.FINISHED ? (
          <div className="h-screen bg-purple-900 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Obrigado!</h1>
            <p>Você completou o questionário.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 text-white underline opacity-50 hover:opacity-100"
            >
              Sair
            </button>
          </div>
        ) : (
          <PlayerView
            question={currentQuestion}
            phase={
              gameState.phase === GamePhase.LOBBY
                ? GamePhase.LOBBY
                : gameState.phase
            }
            onVote={(optionId) => {
              console.log("Voting for:", optionId);
              if (socketRef.current) {
                socketRef.current.emit("player_vote", {
                  questionId: currentQuestion.id,
                  optionId: optionId,
                });
              }
            }}
            currentQuestionIndex={gameState.currentQuestionIndex}
            totalQuestions={QUIZ_DATA.length}
          />
        )}

        {/* Small status indicator */}
        <div
          className={`fixed bottom-2 right-2 w-3 h-3 rounded-full ${
            socketRef.current?.connected ? "bg-green-500" : "bg-red-500"
          }`}
          title={socketRef.current?.connected ? "Online" : "Offline"}
        ></div>
      </div>
    );
  }

  return null;
};

export default App;
