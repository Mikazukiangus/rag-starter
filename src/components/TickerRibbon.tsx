import React from 'react';
import { BenchmarkIndex } from '../types/market';

interface TickerRibbonProps {
  benchmarks: BenchmarkIndex[];
  onSelectBenchmark?: (benchmark: BenchmarkIndex) => void;
}

export const TickerRibbon: React.FC<TickerRibbonProps> = ({ benchmarks, onSelectBenchmark }) => {
  return (
    <section aria-label="Global Benchmark Ticker" className="border-b border-[#2a2e39] bg-[#131722]/90 backdrop-blur-sm overflow-x-auto whitespace-nowrap scrollbar-none">
      <div className="flex items-center divide-x divide-[#2a2e39]/80 px-4 py-2 min-w-max">
        {benchmarks.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectBenchmark?.(item)}
            className={`px-4 ${idx === 0 ? 'pl-0' : ''} flex items-center gap-3 cursor-pointer hover:bg-[#1e222d]/60 rounded py-0.5 transition-colors group`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide group-hover:text-[#2962ff] transition-colors">
                  {item.name}
                </span>
                <span className="text-[10px] text-[#787b86] uppercase font-medium">
                  {item.subtitle}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold font-mono text-white num-tabular">
                  {item.value.toLocaleString(undefined, {
                    minimumFractionDigits: item.value < 10 ? 3 : 2,
                    maximumFractionDigits: item.value < 10 ? 3 : 2,
                  })}
                  {item.subtitle === 'BONDS' ? '%' : ''}
                </span>
                <span
                  className={`text-xs font-medium num-tabular flex items-center ${
                    item.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {item.changePercent >= 0 ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                </span>
              </div>
            </div>

            {/* Sparkline SVG */}
            <svg
              className={`w-16 h-7 ${item.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}
              fill="none"
              viewBox="0 0 60 25"
            >
              {item.isPositive ? (
                <path
                  d="M1 20 L10 17 L22 19 L32 12 L44 14 L52 6 L59 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                />
              ) : (
                <path
                  d="M1 5 L14 8 L25 6 L35 15 L45 13 L52 20 L59 22"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                />
              )}
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
};
