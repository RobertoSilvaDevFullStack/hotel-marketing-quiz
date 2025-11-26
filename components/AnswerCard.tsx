import React from 'react';
import { Option } from '../types';
import { ShapeIcon } from './ShapeIcon';

interface AnswerCardProps {
  option: Option;
  onClick?: () => void;
  disabled?: boolean;
  showText?: boolean;
  selected?: boolean;
  voteCount?: number;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  option,
  onClick,
  disabled,
  showText = true,
  selected,
  voteCount
}) => {
  let bgClass = '';
  switch (option.color) {
    case 'red': bgClass = 'bg-red-600'; break;
    case 'blue': bgClass = 'bg-blue-600'; break;
    case 'yellow': bgClass = 'bg-yellow-500'; break;
    case 'green': bgClass = 'bg-green-600'; break;
    default: bgClass = 'bg-gray-500';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full h-full p-4 flex items-center justify-between
        text-white font-bold shadow-lg transition-all transform
        ${bgClass}
        ${disabled ? 'opacity-90 cursor-default' : 'hover:scale-[1.02] hover:shadow-xl active:scale-95 cursor-pointer'}
        ${selected ? 'ring-4 ring-white/50 z-10' : ''}
        rounded-sm
      `}
    >
      <div className={`flex items-center gap-4 flex-1 overflow-hidden transition-opacity ${selected ? 'opacity-30' : 'opacity-100'}`}>
        <div className="flex-shrink-0">
          <ShapeIcon shape={option.shape} />
        </div>
        {showText && (
          <span className="text-left text-xl md:text-3xl font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] truncate">
            {option.text}
          </span>
        )}
      </div>

      {/* Vote Count Badge */}
      {typeof voteCount === 'number' && (
        <div className="flex-shrink-0 ml-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 min-w-[60px] text-center">
          <span className="text-2xl md:text-3xl font-black text-white">{voteCount}</span>
        </div>
      )}

      {/* Animated Checkmark Overlay */}
      {selected && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-white text-green-600 rounded-full p-3 shadow-2xl animate-pop-in flex items-center justify-center">
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
};