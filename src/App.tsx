import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TickerRibbon } from './components/TickerRibbon';
import { TrendingAssetsTable } from './components/TrendingAssetsTable';
import { AssetSpotlightChart } from './components/AssetSpotlightChart';
import { TopMarketNews } from './components/TopMarketNews';
import { EconomicCalendar } from './components/EconomicCalendar';
import { MarketHeatmap } from './components/MarketHeatmap';
import { SearchModal } from './components/SearchModal';
import { FullScreenerModal } from './components/FullScreenerModal';
import { SpaceStoryModal } from './components/SpaceStoryModal';
import { FloatingSpaceBanner } from './components/FloatingSpaceBanner';
import { BENCHMARK_INDICES, ALL_ASSETS, TOP_MARKET_NEWS, TODAY_ECONOMIC_EVENTS } from './data/marketData';
import { MarketAsset, BenchmarkIndex } from './types/market';
import { Layers } from 'lucide-react';

export default function App() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkIndex[]>(BENCHMARK_INDICES);
  const [assets, setAssets] = useState<MarketAsset[]>(ALL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(ALL_ASSETS[0]); // NVDA default
  const [categoryFilter, setCategoryFilter] = useState<string>('All markets');
  const [overviewTimeframe, setOverviewTimeframe] = useState<string>('1D');
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState(30);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isSpaceStoryOpen, setIsSpaceStoryOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('Markets');

  // Simulated live market ticks
  useEffect(() => {
    if (!isLiveSync) return;

    const interval = setInterval(() => {
      // Increment elapsed counter
      setLastUpdatedSeconds((prev) => (prev >= 60 ? 1 : prev + 1));

      // Occasional random micro-tick on a random asset
      if (Math.random() > 0.4) {
        setAssets((prevAssets) => {
          const randomIndex = Math.floor(Math.random() * prevAssets.length);
          const target = prevAssets[randomIndex];
          const delta = (Math.random() - 0.48) * (target.lastPrice * 0.001);
          const newPrice = Math.max(1, Math.round((target.lastPrice + delta) * 100) / 100);
          const newChangePrice = Math.round((target.changePrice + delta) * 100) / 100;
          const newChangePercent = Math.round(((newChangePrice / (newPrice - newChangePrice)) * 100) * 100) / 100;

          const updated = [...prevAssets];
          updated[randomIndex] = {
            ...target,
            lastPrice: newPrice,
            changePrice: newChangePrice,
            changePercent: newChangePercent,
          };

          // Also sync selected asset if it was updated
          if (target.symbol === selectedAsset.symbol) {
            setSelectedAsset(updated[randomIndex]);
          }

          return updated;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveSync, selectedAsset.symbol]);

  const handleManualRefresh = () => {
    setLastUpdatedSeconds(0);
  };

  const handleSelectAssetBySymbol = (symbol: string) => {
    const found = assets.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      setSelectedAsset(found);
    }
  };

  // Filter assets by category if needed
  const categoryFilteredAssets =
    categoryFilter === 'All markets'
      ? assets
      : assets.filter((a) => a.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="bg-[#131722] text-[#f0f3fa] min-h-screen flex flex-col selection:bg-[#2962ff] selection:text-white">
      {/* Top Header Navigation */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        onOpenScreener={() => setIsScreenerOpen(true)}
        onOpenHeatmap={() => setCategoryFilter('Heatmap')}
      />

      {/* Global Benchmark Ticker Ribbon */}
      <TickerRibbon
        benchmarks={benchmarks}
        onSelectBenchmark={(item) => {
          // If a corresponding asset exists, select it
          const matching = assets.find((a) => a.symbol === item.subtitle || a.name.includes(item.name));
          if (matching) setSelectedAsset(matching);
        }}
      />

      {/* Markets Overview Header */}
      <section className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 pt-6 pb-4">
        {/* Top Row: Page Title + Live Market Status Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2e39]/60 pb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Market of today
            </h1>

            {/* Live Market Status Badge */}
            <button
              onClick={() => setIsLiveSync(!isLiveSync)}
              className="inline-flex items-center gap-2 bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors"
              title="Click to toggle real-time sync simulation"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveSync ? 'bg-[#089981] pulse-dot' : 'bg-[#787b86]'
                }`}
              />
              <span className="text-white font-semibold">
                {isLiveSync ? 'Markets open' : 'Sync paused'}
              </span>
              <span className="text-[#787b86]">· Real-time sync</span>
            </button>
          </div>

          {/* Timeframe Toggle Switchers */}
          <div className="flex items-center bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39] self-start md:self-auto text-xs font-semibold">
            {(['1D', '5D', '1M', 'YTD', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setOverviewTimeframe(tf)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  overviewTimeframe === tf
                    ? 'bg-[#2a2e39] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none text-sm font-medium">
          {[
            'All markets',
            'Indices',
            'Stocks',
            'Crypto',
            'Forex',
            'Futures',
            'Bonds',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full shrink-0 transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white border border-[#2a2e39]'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Heatmap button */}
          <button
            onClick={() => setCategoryFilter('Heatmap')}
            className={`px-4 py-1.5 rounded-full border shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'Heatmap'
                ? 'bg-[#2962ff] text-white font-semibold border-[#2962ff]'
                : 'bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white border-[#2a2e39]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#2962ff] group-hover:text-white" />
            <span>Heatmap</span>
          </button>
        </div>
      </section>

      {/* Main Content Viewport */}
      <main className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 pb-20 flex-1">
        {categoryFilter === 'Heatmap' ? (
          <MarketHeatmap
            onSelectAssetBySymbol={handleSelectAssetBySymbol}
            onClose={() => setCategoryFilter('All markets')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* COLUMN 1: Trending Markets & Top Movers Table */}
            <section
              aria-label="Trending Assets & Screener List"
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <TrendingAssetsTable
                assets={categoryFilteredAssets.length > 0 ? categoryFilteredAssets : assets}
                selectedSymbol={selectedAsset.symbol}
                onSelectAsset={(asset) => setSelectedAsset(asset)}
                onOpenScreener={() => setIsScreenerOpen(true)}
                lastUpdatedSeconds={lastUpdatedSeconds}
                onManualRefresh={handleManualRefresh}
              />
            </section>

            {/* COLUMN 2: Interactive Spotlight Chart & Technicals */}
            <section
              aria-label="Featured Asset Spotlight Chart"
              className="lg:col-span-4 flex flex-col gap-4"
            >
              <AssetSpotlightChart asset={selectedAsset} />
            </section>

            {/* COLUMN 3: Market News & Live Economic Calendar */}
            <section
              aria-label="Market News and Economic Calendar"
              className="lg:col-span-3 flex flex-col gap-6"
            >
              <TopMarketNews
                news={TOP_MARKET_NEWS}
                onSelectTicker={handleSelectAssetBySymbol}
              />
              <EconomicCalendar events={TODAY_ECONOMIC_EVENTS} />
            </section>
          </div>
        )}
      </main>

      {/* Floating Pill Banner (Space Story with Scott "Kidd" Poteet) */}
      <FloatingSpaceBanner onClick={() => setIsSpaceStoryOpen(true)} />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      <FullScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      <SpaceStoryModal
        isOpen={isSpaceStoryOpen}
        onClose={() => setIsSpaceStoryOpen(false)}
      />
    </div>
  );
}
