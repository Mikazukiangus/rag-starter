import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { X, Search, Download, ArrowUpDown, ChevronDown, Check } from 'lucide-react';

interface FullScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const FullScreenerModal: React.FC<FullScreenerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof MarketAsset>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen) return null;

  const sectors = ['All', ...Array.from(new Set(assets.map((a) => a.sector)))];

  const filtered = assets
    .filter((a) => {
      const matchSearch =
        a.symbol.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase());
      const matchSector = selectedSector === 'All' || a.sector === selectedSector;
      return matchSearch && matchSector;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortAsc
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

  const handleExportCSV = () => {
    const headers = ['Symbol', 'Name', 'Price', 'Change%', 'Volume', 'MarketCap', 'PE', 'Sector'];
    const rows = filtered.map((a) => [
      a.symbol,
      `"${a.name}"`,
      a.lastPrice,
      a.changePercent,
      a.volume,
      a.marketCap,
      a.peRatio,
      `"${a.sector}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stock_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: keyof MarketAsset) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-5xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Full US Stock & Asset Screener</span>
            </h2>
            <p className="text-xs text-[#787b86]">
              Scan, rank, and analyze tickers across valuation, momentum, and technical ratings
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#787b86] hover:text-white p-1.5 rounded-lg bg-[#2a2e39] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="flex items-center justify-between py-3 gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter symbols..."
                className="w-full bg-[#131722] border border-[#2a2e39] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#2962ff]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#787b86]">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-[#131722] border border-[#2a2e39] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#2962ff]"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2e39] hover:bg-[#363a45] text-xs text-white font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Screener Table */}
        <div className="overflow-x-auto flex-1 divide-y divide-[#2a2e39]/40 border border-[#2a2e39] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#131722] sticky top-0 z-10">
              <tr className="text-[#787b86] uppercase font-semibold text-[11px] border-b border-[#2a2e39]">
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 pl-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3">Name</th>
                <th
                  onClick={() => handleSort('lastPrice')}
                  className="py-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Chg %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volumeNum')}
                  className="py-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 text-right">Market Cap</th>
                <th className="py-3 text-right">P/E Ratio</th>
                <th className="py-3 pl-4">Technical Rating</th>
                <th className="py-3 pr-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/40 font-medium">
              {filtered.map((asset) => {
                const isPos = asset.changePercent >= 0;
                return (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-[#2a2e39]/50 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                  >
                    <td className="py-2.5 pl-3 font-bold font-mono text-white group-hover:text-[#2962ff]">
                      {asset.symbol}
                    </td>
                    <td className="py-2.5 text-[#787b86] truncate max-w-[140px]">
                      {asset.name}
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-white num-tabular">
                      ${asset.lastPrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right">
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
                    <td className="py-2.5 text-right font-mono text-[#f0f3fa] num-tabular">
                      {asset.volume}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#787b86]">
                      {asset.marketCap}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#787b86]">
                      {asset.peRatio}
                    </td>
                    <td className="py-2.5 pl-4">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          asset.technicals.rating.includes('BUY')
                            ? 'text-[#089981]'
                            : asset.technicals.rating.includes('SELL')
                            ? 'text-[#f23645]'
                            : 'text-[#787b86]'
                        }`}
                      >
                        {asset.technicals.rating}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-[#2962ff]/20 hover:bg-[#2962ff] text-[#2962ff] hover:text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Chart
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#787b86]">
          <span>Showing {filtered.length} of {assets.length} tracked equities</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2962ff] text-white font-semibold rounded-lg hover:bg-[#2962ff]/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
