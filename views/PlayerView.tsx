
import React, { useState, useEffect } from 'react';
import { GamePhase, Question } from '../types';
import { AnswerCard } from '../components/AnswerCard';
import { playSound } from '../utils/sound';

interface PlayerViewProps {
  question: Question;
  phase: GamePhase;
  onVote: (optionId: string) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const PlayerView: React.FC<PlayerViewProps> = ({ 
  question, 
  phase, 
  onVote,
  currentQuestionIndex,
  totalQuestions
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    // Reset selection on new question
    if (phase === GamePhase.READING) {
      setSelectedOptionId(null);
    }
  }, [phase, question.id]);

  const handleVote = (id: string) => {
    if (phase === GamePhase.ANSWERING && !selectedOptionId) {
      playSound('click');
      setSelectedOptionId(id);
      onVote(id);
    }
  };

  const isInteractive = phase === GamePhase.ANSWERING;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-sm z-10">
        <div className="flex justify-between items-center mb-2">
            <span className="font-black text-purple-900 tracking-tight">Kahoot!</span>
            <span className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full">
                Questão {currentQuestionIndex + 1} de {totalQuestions}
            </span>
        </div>
        {/* Question Text for context */}
        <h2 className="text-gray-800 text-lg font-semibold leading-tight text-center">
            {question.question}
        </h2>
      </header>

      <main className="flex-1 p-4 flex flex-col justify-center overflow-y-auto">
        
        {/* Waiting / Buffer States */}
        {phase === GamePhase.LOBBY && (
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Aguardando início...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
            </div>
        )}

        {phase === GamePhase.READING && (
            <div className="text-center animate-pulse">
                <h2 className="text-3xl font-bold text-purple-900">Prepare-se!</h2>
                <p className="mt-4 text-gray-600">A votação vai começar...</p>
            </div>
        )}

        {phase === GamePhase.BUFFER && (
             <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Enviado!</h2>
                <p className="text-gray-600 mt-2">Processando resultados...</p>
                <div className="mt-8">
                     <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                </div>
             </div>
        )}

        {phase === GamePhase.RESULTS && (
             <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Confira o resultado!</h2>
                <p className="text-gray-600 mt-2">Olhe para o telão principal.</p>
             </div>
        )}

        {/* Voting Grid */}
        {phase === GamePhase.ANSWERING && (
          <div className="grid grid-cols-2 gap-4 h-full max-h-[600px]">
            {question.options.map(opt => (
              <AnswerCard 
                key={opt.id} 
                option={opt} 
                showText={false} // Usually hidden on mobile for Kahoot style, but can be true if needed. Kept false for big buttons.
                onClick={() => handleVote(opt.id)}
                disabled={!!selectedOptionId}
                selected={selectedOptionId === opt.id}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white p-3 text-center border-t border-gray-200">
        <p className={`text-sm font-medium ${selectedOptionId ? "text-green-600" : "text-gray-500"}`}>
            {selectedOptionId ? "Resposta registrada com sucesso" : isInteractive ? "Selecione uma resposta acima" : "Aguarde a próxima etapa"}
        </p>
      </footer>
    </div>
  );
};
