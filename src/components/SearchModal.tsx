import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Stocks' | 'Crypto' | 'Indices'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter((asset) => {
    const matchesQuery =
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.sector.toLowerCase().includes(query.toLowerCase());

    if (categoryFilter === 'All') return matchesQuery;
    return matchesQuery && asset.category === categoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2a2e39] gap-3">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, or sector (e.g. NVDA, Tesla)..."
            className="flex-1 bg-transparent text-sm text-[#f0f3fa] placeholder-[#787b86] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#787b86] hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#787b86] bg-[#2a2e39] border border-[#2a2e39]/80 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden text-xs text-[#787b86] hover:text-white"
          >
            Cancel
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#131722]/60 border-b border-[#2a2e39]/60 text-xs">
          {(['All', 'Stocks', 'Crypto'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#2962ff] text-white font-medium'
                  : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-[#787b86]">
            {filteredAssets.length} results
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-[#2a2e39]/40 p-2 flex-1">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#787b86]">
              No matching assets found for "{query}"
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#2a2e39]/70 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shrink-0 border ${asset.badgeBg}`}
                  >
                    {asset.badgeText}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] px-1 py-0.2 bg-[#2a2e39] rounded text-[#787b86]">
                        {asset.exchange}
                      </span>
                    </div>
                    <div className="text-xs text-[#787b86] truncate max-w-[200px] sm:max-w-xs">
                      {asset.name} · {asset.sector}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-mono font-semibold text-white num-tabular">
                      ${asset.lastPrice.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-mono font-medium flex items-center justify-end gap-0.5 ${
                        asset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {asset.changePercent >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {asset.changePercent >= 0 ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#787b86] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
