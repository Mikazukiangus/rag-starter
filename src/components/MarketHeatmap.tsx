import React, { useState } from 'react';
import { HEATMAP_DATA } from '../data/marketData';
import { HeatmapItem, MarketAsset } from '../types/market';
import { ArrowLeft, Layers, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface MarketHeatmapProps {
  onSelectAssetBySymbol: (symbol: string) => void;
  onClose: () => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  onSelectAssetBySymbol,
  onClose,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Group by sector
  const sectors = Array.from(new Set(HEATMAP_DATA.map((item) => item.sector)));

  const filteredItems =
    selectedSector === 'All'
      ? HEATMAP_DATA
      : HEATMAP_DATA.filter((i) => i.sector === selectedSector);

  // Helper color for percentage change
  const getTileBg = (chg: number) => {
    if (chg >= 5) return 'bg-[#089981] text-white';
    if (chg >= 2) return 'bg-[#059669] text-white';
    if (chg > 0) return 'bg-[#065f46] text-white';
    if (chg === 0) return 'bg-[#2a2e39] text-[#787b86]';
    if (chg > -2) return 'bg-[#7f1d1d] text-white';
    if (chg > -5) return 'bg-[#b91c1c] text-white';
    return 'bg-[#f23645] text-white';
  };

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-6 shadow-xl flex flex-col min-h-[550px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4 mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#2a2e39] hover:bg-[#363a45] text-white transition-colors cursor-pointer"
            title="Return to Main Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2962ff]" />
              <span>S&P 500 Market Heatmap</span>
            </h2>
            <p className="text-xs text-[#787b86]">
              Real-time sector performance weighted by market capitalization
            </p>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setSelectedSector('All')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              selectedSector === 'All'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'bg-[#131722] text-[#787b86] hover:text-white'
            }`}
          >
            All Sectors
          </button>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedSector === sec
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'bg-[#131722] text-[#787b86] hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 flex-1">
        {filteredItems.map((item) => {
          const isPos = item.changePercent >= 0;
          return (
            <button
              key={item.symbol}
              onClick={() => {
                onSelectAssetBySymbol(item.symbol);
                onClose();
              }}
              className={`rounded-xl p-3 flex flex-col justify-between transition-all duration-150 hover:scale-[1.03] hover:shadow-xl text-left cursor-pointer border border-black/10 group ${getTileBg(
                item.changePercent
              )}`}
              style={{
                minHeight: item.marketCapBillion > 2000 ? '130px' : '95px',
                gridColumn: item.marketCapBillion > 3000 ? 'span 2' : 'span 1',
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm sm:text-base tracking-wide font-mono">
                  {item.symbol}
                </span>
                <span className="text-[10px] opacity-80 font-mono">
                  ${(item.marketCapBillion / 1000).toFixed(1)}T
                </span>
              </div>

              <div>
                <div className="text-xs truncate opacity-90">{item.name}</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs font-mono font-semibold">
                    ${item.lastPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono font-bold flex items-center gap-0.5">
                    {isPos ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend & Back Action */}
      <div className="mt-4 pt-4 border-t border-[#2a2e39] flex items-center justify-between flex-wrap gap-3 text-xs text-[#787b86]">
        <div className="flex items-center gap-2">
          <span>Performance Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-5 h-3 bg-[#f23645] rounded-xs text-[9px] text-white text-center font-bold">-3%</span>
            <span className="w-5 h-3 bg-[#b91c1c] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#7f1d1d] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#2a2e39] rounded-xs text-[9px] text-center">0%</span>
            <span className="w-5 h-3 bg-[#065f46] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#059669] rounded-xs"></span>
            <span className="w-5 h-3 bg-[#089981] rounded-xs text-[9px] text-white text-center font-bold">+3%</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#2962ff] hover:underline font-semibold cursor-pointer"
        >
          Return to Overview Dashboard →
        </button>
      </div>
    </div>
  );
};
