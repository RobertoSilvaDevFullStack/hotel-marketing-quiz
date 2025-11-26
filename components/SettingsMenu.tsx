import React, { useState, useEffect } from "react";
import { TimerConfig } from "../types";
import { X, Save, Clock } from "lucide-react";

interface SettingsMenuProps {
  config: TimerConfig;
  onSave: (newConfig: TimerConfig) => void;
  onClose: () => void;
  onBackToMenu?: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  config,
  onSave,
  onClose,
  onBackToMenu,
}) => {
  const [localConfig, setLocalConfig] = useState<TimerConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (key: keyof TimerConfig, value: string) => {
    const numVal = parseInt(value, 10);
    if (!isNaN(numVal) && numVal >= 0) {
      setLocalConfig((prev) => ({ ...prev, [key]: numVal }));
    }
  };

  const handleSave = () => {
    onSave(localConfig);
  };

  return (
    <div className="absolute top-16 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-fade-in origin-top-right">
      {/* Triangle pointer */}
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>

      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          Tempos (segundos)
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Leitura
            </label>
            <input
              type="number"
              value={localConfig.READING}
              onChange={(e) => handleChange("READING", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Votação
            </label>
            <input
              type="number"
              value={localConfig.ANSWERING}
              onChange={(e) => handleChange("ANSWERING", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Buffer
            </label>
            <input
              type="number"
              value={localConfig.BUFFER}
              onChange={(e) => handleChange("BUFFER", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Resultados
            </label>
            <input
              type="number"
              value={localConfig.RESULTS}
              onChange={(e) => handleChange("RESULTS", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>

        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="w-full mt-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 border border-red-300"
          >
            <X className="w-4 h-4" />
            Voltar ao Menu
          </button>
        )}
      </div>
    </div>
  );
};
