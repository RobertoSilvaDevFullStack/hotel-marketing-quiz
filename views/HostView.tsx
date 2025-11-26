import React, { useEffect, useState } from "react";
import { GamePhase, Question, TimerConfig } from "../types";
import { AnswerCard } from "../components/AnswerCard";
import { ResultsChart } from "../components/ResultsChart";
import { Loader2, Settings } from "lucide-react";
import { playSound } from "../utils/sound";
import { SettingsMenu } from "../components/SettingsMenu";

interface HostViewProps {
  question: Question;
  phase: GamePhase;
  timeLeft: number;
  answers: Record<string, number>;
  totalQuestions: number;
  currentQuestionIndex: number;
  timerConfig: TimerConfig;
  onUpdateTimers: (newConfig: TimerConfig) => void;
  onBackToMenu?: () => void;
}

export const HostView: React.FC<HostViewProps> = ({
  question,
  phase,
  timeLeft,
  answers,
  totalQuestions,
  currentQuestionIndex,
  timerConfig,
  onUpdateTimers,
  onBackToMenu,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  // Sound Effects for Phases
  useEffect(() => {
    if (phase === GamePhase.ANSWERING) {
      playSound("go");
    } else if (phase === GamePhase.BUFFER) {
      playSound("timesUp");
    } else if (phase === GamePhase.RESULTS) {
      playSound("reveal");
    }
  }, [phase]);

  // Sound Effects for Ticks (Last 5 seconds)
  useEffect(() => {
    if (phase === GamePhase.ANSWERING && timeLeft <= 5 && timeLeft > 0) {
      playSound("tick");
    }
  }, [timeLeft, phase]);

  // Always use real answers from database (received via WebSocket)
  const displayData = answers;

  const totalVotes = Object.values(displayData).reduce(
    (a: number, b: number) => a + b,
    0
  );

  const handleConfigSave = (newConfig: TimerConfig) => {
    onUpdateTimers(newConfig);
    setShowSettings(false);
    playSound("click");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden relative">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center h-16 z-20 relative">
        <div className="flex items-center gap-4">
          <span className="font-black text-2xl text-purple-800 tracking-tighter">
            Kahoot!
          </span>
          <span className="bg-gray-200 px-3 py-1 rounded-full font-bold text-gray-700">
            Marketing Hoteleiro
          </span>
        </div>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              playSound("click");
            }}
            className={`p-2 rounded-full transition-colors ${
              showSettings
                ? "bg-purple-100 text-purple-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            title="Configurar Tempos"
          >
            <Settings className="w-6 h-6" />
          </button>
          <div className="text-xl font-bold text-gray-600">
            {currentQuestionIndex + 1} de {totalQuestions}
          </div>

          {/* Settings Submenu */}
          {showSettings && (
            <SettingsMenu
              config={timerConfig}
              onSave={handleConfigSave}
              onClose={() => setShowSettings(false)}
              onBackToMenu={onBackToMenu}
            />
          )}
        </div>
      </header>

      {/* Main Stage */}
      <main
        className="flex-1 relative flex flex-col items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://picsum.photos/1920/1080?blur=4)",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>

        {/* Question Text */}
        <div className="relative z-10 bg-white p-8 rounded shadow-2xl mb-8 max-w-5xl w-full text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            {question.question}
          </h1>
        </div>

        {/* Center Content Area */}
        <div className="relative z-10 w-full max-w-6xl flex-1 flex flex-col justify-center gap-4">
          {/* Reading/Answering Phase: Image placeholder or empty space for focus */}
          {(phase === GamePhase.READING || phase === GamePhase.ANSWERING) && (
            <div className="flex-1 flex items-center justify-center mb-6">
              <div
                className={`bg-purple-600 text-white rounded-full w-32 h-32 flex items-center justify-center shadow-xl ${
                  timeLeft <= 5 ? "animate-ping" : "animate-pulse"
                }`}
              >
                <span className="text-5xl font-black">{timeLeft}</span>
              </div>
            </div>
          )}

          {/* Buffer Phase */}
          {phase === GamePhase.BUFFER && (
            <div className="flex-1 flex flex-col items-center justify-center text-white animate-fade-in">
              <Loader2 className="w-24 h-24 animate-spin mb-4" />
              <h2 className="text-4xl font-bold">Carregando respostas...</h2>
              <p className="text-2xl mt-2 opacity-80">Olhe para o telão!</p>
            </div>
          )}

          {/* Results Phase - Graph */}
          {phase === GamePhase.RESULTS && (
            <div className="flex-[2] h-full w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-inner">
              <ResultsChart options={question.options} data={displayData} />
            </div>
          )}

          {/* Answer Grid (Visible during Reading/Answering) */}
          {(phase === GamePhase.ANSWERING || phase === GamePhase.READING) && (
            <div className="grid grid-cols-2 gap-4 w-full h-64">
              {question.options.map((opt) => (
                <AnswerCard
                  key={opt.id}
                  option={opt}
                  disabled={true}
                  // Live votes can be shown here if desired, currently hidden
                  voteCount={displayData[opt.id] || 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-purple-900 text-white p-3 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Respostas: {totalVotes}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs uppercase opacity-75">Status</div>
            <div className="font-bold text-lg">
              {phase === GamePhase.READING
                ? "Lendo..."
                : phase === GamePhase.ANSWERING
                ? "Votando..."
                : phase === GamePhase.BUFFER
                ? "Processando..."
                : "Resultados"}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
