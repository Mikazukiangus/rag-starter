import React, { useState } from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface TrendingAssetsTableProps {
  assets: MarketAsset[];
  selectedSymbol: string;
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenScreener: () => void;
  lastUpdatedSeconds: number;
  onManualRefresh: () => void;
}

export const TrendingAssetsTable: React.FC<TrendingAssetsTableProps> = ({
  assets,
  selectedSymbol,
  onSelectAsset,
  onOpenScreener,
  lastUpdatedSeconds,
  onManualRefresh,
}) => {
  const [filterTab, setFilterTab] = useState<'Gainers' | 'Losers' | 'Active' | '52W High'>('Gainers');

  // Filter or sort assets based on sub-tab
  let displayedAssets = [...assets];
  if (filterTab === 'Gainers') {
    // Show top positive movers (or preserve original curated order when matching top gainers)
    displayedAssets = displayedAssets.sort((a, b) => b.changePercent - a.changePercent);
  } else if (filterTab === 'Losers') {
    displayedAssets = displayedAssets.sort((a, b) => a.changePercent - b.changePercent);
  } else if (filterTab === 'Active') {
    displayedAssets = displayedAssets.sort((a, b) => b.volumeNum - a.volumeNum);
  } else if (filterTab === '52W High') {
    displayedAssets = displayedAssets.filter((a) => a.lastPrice / a.high52w >= 0.95);
  }

  // Keep top 6-8 items for tidy card height matching the column height
  const visibleAssets = displayedAssets.slice(0, 6);

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col h-full shadow-lg">
      {/* Card Header & Sub-tabs */}
      <div className="flex items-center justify-between border-b border-[#2a2e39]/80 pb-3 flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Trending Assets
            <span className="text-xs font-normal text-[#787b86]">US Market</span>
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-[#131722] p-1 rounded-lg text-xs font-medium">
          {(['Gainers', 'Losers', 'Active', '52W High'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterTab === tab
                  ? 'bg-[#2a2e39] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Market Table */}
      <div className="overflow-x-auto mt-2 flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-[#787b86] border-b border-[#2a2e39]/60 uppercase font-semibold text-[11px]">
              <th className="py-2.5 pl-1">Symbol</th>
              <th className="py-2.5 text-right">Last</th>
              <th className="py-2.5 text-right">Chg $</th>
              <th className="py-2.5 text-right">Chg %</th>
              <th className="py-2.5 text-center pr-1">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/40 font-medium">
            {visibleAssets.map((asset) => {
              const isSelected = asset.symbol === selectedSymbol;
              const isPos = asset.changePercent >= 0;

              return (
                <tr
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className={`transition-colors group cursor-pointer ${
                    isSelected ? 'bg-[#2a2e39]/60' : 'hover:bg-[#2a2e39]/40'
                  }`}
                >
                  <td className="py-3 pl-1 flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0 border ${asset.badgeBg}`}
                    >
                      {asset.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors flex items-center gap-1">
                        {asset.symbol}
                        <span className="text-[9px] px-1 py-0.2 bg-[#2a2e39] rounded text-[#787b86]">
                          D
                        </span>
                      </div>
                      <div className="text-[11px] text-[#787b86] truncate max-w-[110px]">
                        {asset.name}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-right font-mono font-semibold text-white num-tabular">
                    {asset.lastPrice.toFixed(2)}
                  </td>

                  <td
                    className={`py-3 text-right font-mono num-tabular ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? `+${asset.changePrice.toFixed(2)}` : asset.changePrice.toFixed(2)}
                  </td>

                  <td className="py-3 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded font-mono font-semibold num-tabular ${
                        isPos
                          ? 'bg-[rgba(8,153,129,0.12)] text-[#089981]'
                          : 'bg-[rgba(242,54,69,0.12)] text-[#f23645]'
                      }`}
                    >
                      {isPos ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                    </span>
                  </td>

                  <td className="py-3 text-center pr-1">
                    <svg
                      className={`w-14 h-5 inline-block ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}
                      fill="none"
                      viewBox="0 0 50 18"
                    >
                      {isPos ? (
                        <path
                          d="M1 15 L12 12 L22 14 L32 7 L40 9 L49 2"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.8"
                        />
                      ) : (
                        <path
                          d="M1 4 L14 6 L25 5 L35 12 L44 10 L49 16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.8"
                        />
                      )}
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Bottom Bar */}
      <div className="mt-4 pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#787b86]">
        <button
          onClick={onManualRefresh}
          className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"
          title="Click to refresh market ticks"
        >
          <RefreshCw className="w-3 h-3 text-[#787b86]" />
          <span>Updated {lastUpdatedSeconds}s ago</span>
        </button>

        <button
          onClick={onOpenScreener}
          className="text-[#2962ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Open Full Screener</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
