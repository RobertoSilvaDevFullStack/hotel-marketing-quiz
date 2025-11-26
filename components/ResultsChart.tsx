import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Option } from "../types";

interface ResultsChartProps {
  options: Option[];
  data: Record<string, number>;
}

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-75" y="0" width="150" height="80">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="flex items-start justify-center h-full pt-2"
        >
          <p className="text-xs md:text-sm font-semibold text-gray-700 text-center leading-tight line-clamp-3 px-1">
            {payload.value}
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

export const ResultsChart: React.FC<ResultsChartProps> = ({
  options,
  data,
}) => {
  // Validação defensiva - evita erro quando options ou data forem undefined
  if (!options || !Array.isArray(options) || options.length === 0) {
    return (
      <div className="w-full h-full bg-white/95 rounded-xl p-6 shadow-2xl flex items-center justify-center backdrop-blur-md border border-white/50">
        <p className="text-gray-500 text-xl">Carregando resultados...</p>
      </div>
    );
  }

  if (!data || typeof data !== 'object') {
    return (
      <div className="w-full h-full bg-white/95 rounded-xl p-6 shadow-2xl flex items-center justify-center backdrop-blur-md border border-white/50">
        <p className="text-gray-500 text-xl">Aguardando votos...</p>
      </div>
    );
  }

  const chartData = options.map((opt) => ({
    name: opt.text,
    count: data[opt.id] || 0,
    color:
      opt.color === "red"
        ? "#dc2626"
        : opt.color === "blue"
          ? "#2563eb"
          : opt.color === "yellow"
            ? "#ca8a04"
            : "#16a34a",
    id: opt.id,
  }));
  const totalVotes = Object.values(data).reduce(
    (sum: number, val) => sum + (val as number),
    0
  );

  return (
    <div className="w-full h-full bg-white/95 rounded-xl p-6 shadow-2xl flex flex-col backdrop-blur-md border border-white/50">
      <div className="h-full grid grid-cols-4 gap-4 p-4 items-end">
        {options.map((opt) => {
          const count = (data[opt.id] as number) || 0;
          const pct =
            (totalVotes as number) > 0
              ? Math.round((count / (totalVotes as number)) * 100)
              : 0;

          return (
            <div
              key={opt.id}
              className="flex flex-col items-center justify-end relative"
              style={{ height: "100%" }}
            >
              {/* Vote Count Label - Above Bar */}
              {count > 0 && (
                <div className="mb-2 text-center z-10">
                  <div className="text-4xl font-black text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]" style={{ opacity: 1 }}>
                    {count}
                  </div>
                  <div className="text-xl text-black font-extrabold drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]" style={{ opacity: 1 }}>
                    {pct}%
                  </div>
                </div>
              )}

              {/* Animated Bar */}
              <div
                className="w-full rounded-t-lg transition-all duration-700 ease-out relative"
                style={{
                  height: `${pct}%`,
                  minHeight: pct > 0 ? "30px" : "0px",
                  backgroundColor: opt.color,
                }}
              >
                {/* Icon inside bar - only if bar is tall enough AND icon exists */}
                {pct > 12 && opt.icon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <opt.icon className="w-16 h-16 text-white/30" />
                  </div>
                )}
              </div>

              {/* Label Below */}
              <div className="mt-3 text-center text-black text-lg font-extrabold max-w-[120px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]" style={{ opacity: 1 }}>
                {opt.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
