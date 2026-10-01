import React, { useState } from 'react';
import { MarketAsset, CandleData } from '../types/market';
import { SlidersHorizontal, Eye, BarChart2, TrendingUp, Info } from 'lucide-react';

interface AssetSpotlightChartProps {
  asset: MarketAsset;
}

export const AssetSpotlightChart: React.FC<AssetSpotlightChartProps> = ({ asset }) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1H' | 'D' | 'W'>('D');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showIndicators, setShowIndicators] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<{
    candle: CandleData;
    index: number;
    x: number;
    y: number;
  } | null>(null);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const candles: CandleData[] = asset.candles[timeframe] || asset.candles['D'];

  // Price calculations for chart scale
  const allPrices = candles.flatMap((c) => [c.low, c.high]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  // Grid levels
  const step = priceRange / 3;
  const gridLevels = [
    maxPrice,
    maxPrice - step,
    maxPrice - step * 2,
    minPrice,
  ];

  // Map price to SVG Y coordinate (viewBox height 180, usable range 15 to 160)
  const svgHeight = 180;
  const paddingTop = 15;
  const paddingBottom = 20;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getY = (price: number) => {
    return paddingTop + (1 - (price - minPrice) / priceRange) * chartHeight;
  };

  // Coordinates for candles
  const svgWidth = 400;
  const candleCount = candles.length;
  const candleSpacing = svgWidth / (candleCount + 1);

  // Moving average line data points (simple 3-period rolling average)
  const maPoints = candles.map((c, i) => {
    const start = Math.max(0, i - 2);
    const slice = candles.slice(start, i + 1);
    const avg = slice.reduce((sum, item) => sum + item.close, 0) / slice.length;
    const x = (i + 1) * candleSpacing;
    const y = getY(avg);
    return `${x},${y}`;
  });

  // EMA 50 / Trendline points
  const emaPoints = candles.map((c, i) => {
    const x = (i + 1) * candleSpacing;
    const y = getY(c.open * 0.995);
    return `${x},${y}`;
  });

  // Line chart path if line view selected
  const linePath = candles
    .map((c, i) => {
      const x = (i + 1) * candleSpacing;
      const y = getY(c.close);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = `${linePath} L ${(candleCount) * candleSpacing} ${svgHeight - paddingBottom} L ${candleSpacing} ${svgHeight - paddingBottom} Z`;

  const isPositive = asset.changePercent >= 0;

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col h-full shadow-lg">
      {/* Asset Header Bar */}
      <div className="flex items-start justify-between border-b border-[#2a2e39]/80 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-white tracking-tight">{asset.symbol}</span>
            <span className="text-xs px-2 py-0.5 bg-[#2a2e39] rounded text-[#787b86]">
              {asset.exchange}
            </span>
            <span className="text-xs font-medium text-emerald-400">
              {asset.postMarketStatus || 'Live'}
            </span>
          </div>
          <p className="text-xs text-[#787b86]">
            {asset.name} · {timeframe} Chart
          </p>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold font-mono text-white num-tabular">
            ${asset.lastPrice.toFixed(2)}
          </div>
          <div
            className={`text-xs font-semibold flex items-center justify-end gap-1 num-tabular ${
              isPositive ? 'text-[#089981]' : 'text-[#f23645]'
            }`}
          >
            <span>{isPositive ? `+$${asset.changePrice.toFixed(2)}` : `-$${Math.abs(asset.changePrice).toFixed(2)}`}</span>
            <span>({isPositive ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`})</span>
          </div>
        </div>
      </div>

      {/* Chart Controls Bar */}
      <div className="flex items-center justify-between py-2 text-xs border-b border-[#2a2e39]/60">
        <div className="flex items-center gap-1">
          {(['1m', '5m', '15m', '1H', 'D', 'W'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#2962ff]/20 text-[#2962ff] font-bold'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[#787b86]">
          {/* Chart Style Toggle */}
          <button
            onClick={() => setChartType(chartType === 'candles' ? 'line' : 'candles')}
            className={`p-1 rounded transition-colors ${
              chartType === 'candles' ? 'text-[#2962ff] bg-[#2a2e39]' : 'hover:text-white'
            }`}
            title="Toggle Candlesticks / Line"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M7 4v16M7 7h3v6H7zm10-3v16m-3-12h3v10h-3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>

          {/* Indicators Toggle */}
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`p-1 rounded transition-colors ${
              showIndicators ? 'text-amber-400 bg-[#2a2e39]' : 'hover:text-white'
            }`}
            title="Toggle Moving Average Indicators"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Interactive Candlestick / Area Graphic */}
      <div className="relative flex-1 min-h-[260px] py-2 flex flex-col justify-between select-none">
        {/* Background Price Axis Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          {gridLevels.map((lvl, idx) => (
            <div
              key={idx}
              className="border-b border-[#2a2e39]/50 text-[10px] font-mono text-[#787b86] pl-1"
            >
              {lvl.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Hover Crosshair HUD */}
        {hoveredCandle && (
          <div className="absolute top-1 left-2 z-20 bg-[#131722]/90 border border-[#2a2e39] px-2 py-1 rounded text-[10px] font-mono text-[#f0f3fa] flex items-center gap-2 pointer-events-none backdrop-blur-xs">
            <span className="text-[#787b86]">{hoveredCandle.candle.time}</span>
            <span>O: <strong className="text-white">{hoveredCandle.candle.open.toFixed(2)}</strong></span>
            <span>H: <strong className="text-[#089981]">{hoveredCandle.candle.high.toFixed(2)}</strong></span>
            <span>L: <strong className="text-[#f23645]">{hoveredCandle.candle.low.toFixed(2)}</strong></span>
            <span>C: <strong className="text-white">{hoveredCandle.candle.close.toFixed(2)}</strong></span>
          </div>
        )}

        {/* Candlestick / Line SVG */}
        <svg
          className="w-full h-44 relative z-10 overflow-visible"
          preserveAspectRatio="none"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          onMouseLeave={() => setHoveredCandle(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#089981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Technical Moving Average Lines */}
          {showIndicators && (
            <>
              {/* MA 20 (Blue solid line) */}
              <polyline
                fill="none"
                stroke="#2962ff"
                strokeWidth="1.8"
                points={maPoints.join(' ')}
              />
              {/* EMA 50 (Orange dashed line) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth="1.2"
                points={emaPoints.join(' ')}
              />
            </>
          )}

          {/* Chart Renderer: Candlesticks OR Line */}
          {chartType === 'line' ? (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={linePath} fill="none" stroke="#089981" strokeWidth="2" />
            </>
          ) : (
            candles.map((candle, idx) => {
              const x = (idx + 1) * candleSpacing;
              const openY = getY(candle.open);
              const closeY = getY(candle.close);
              const highY = getY(candle.high);
              const lowY = getY(candle.low);
              const isGreen = candle.close >= candle.open;
              const color = isGreen ? '#089981' : '#f23645';
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(3, Math.abs(closeY - openY));
              const bodyWidth = 8;

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredCandle({
                      candle,
                      index: idx,
                      x,
                      y: closeY,
                    })
                  }
                >
                  {/* Wick */}
                  <line
                    x1={x}
                    x2={x}
                    y1={highY}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - bodyWidth / 2}
                    y={bodyTop}
                    width={bodyWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="0.5"
                  />
                </g>
              );
            })
          )}

          {/* Crosshair on hover */}
          {hoveredCandle && (
            <line
              x1={hoveredCandle.x}
              x2={hoveredCandle.x}
              y1={0}
              y2={svgHeight}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}
        </svg>

        {/* Bottom Volume Histogram */}
        <div className="h-10 flex items-end gap-1.5 sm:gap-2 px-3 pt-2 border-t border-[#2a2e39]/40">
          {candles.map((c, i) => {
            const isGreen = c.close >= c.open;
            const heightPercent = Math.min(100, Math.max(20, (c.volume / 10000000) * 100));
            return (
              <div
                key={i}
                style={{ height: `${heightPercent * 0.3}px` }}
                className={`w-1.5 rounded-xs transition-all ${
                  isGreen ? 'bg-[#089981]/80 hover:bg-[#089981]' : 'bg-[#f23645]/70 hover:bg-[#f23645]'
                }`}
                title={`Volume: ${(c.volume / 1000000).toFixed(2)}M`}
              />
            );
          })}
          <div className="ml-auto text-[10px] font-mono text-[#787b86] shrink-0">
            Vol: {asset.volume}
          </div>
        </div>
      </div>

      {/* Technical Analysis Gauge Indicator */}
      <div className="mt-2 pt-3 border-t border-[#2a2e39]">
        <div className="flex items-center justify-between text-xs mb-2">
          <button
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="text-[#787b86] font-semibold hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Technical Rating</span>
            <Info className="w-3 h-3 text-[#787b86]" />
          </button>
          <span
            className={`font-bold uppercase tracking-wider text-[11px] ${
              asset.technicals.rating.includes('BUY')
                ? 'text-[#089981]'
                : asset.technicals.rating.includes('SELL')
                ? 'text-[#f23645]'
                : 'text-[#787b86]'
            }`}
          >
            {asset.technicals.rating}
          </span>
        </div>

        {/* Segmented Rating Bar */}
        <div className="h-2 w-full bg-[#2a2e39] rounded-full flex overflow-hidden p-0.5 gap-0.5">
          <div
            className={`flex-1 rounded-l transition-opacity ${
              asset.technicals.rating === 'STRONG SELL' ? 'bg-[#f23645] ring-1 ring-white/50' : 'bg-[#f23645]/40'
            }`}
          />
          <div
            className={`flex-1 transition-opacity ${
              asset.technicals.rating === 'SELL' ? 'bg-[#f23645] ring-1 ring-white/50' : 'bg-[#f23645]/20'
            }`}
          />
          <div
            className={`flex-1 transition-opacity ${
              asset.technicals.rating === 'NEUTRAL' ? 'bg-white ring-1 ring-white/50' : 'bg-[#787b86]/30'
            }`}
          />
          <div
            className={`flex-1 transition-opacity ${
              asset.technicals.rating === 'BUY' ? 'bg-[#089981] ring-1 ring-white/50' : 'bg-[#089981]/50'
            }`}
          />
          <div
            className={`flex-1 rounded-r transition-opacity ${
              asset.technicals.rating === 'STRONG BUY' ? 'bg-[#089981] ring-1 ring-white/50' : 'bg-[#089981]/40'
            }`}
          />
        </div>

        <div className="flex justify-between text-[9px] text-[#787b86] mt-1 font-semibold">
          <span>STRONG SELL</span>
          <span>NEUTRAL</span>
          <span className="text-[#089981]">STRONG BUY</span>
        </div>

        {/* Collapsible Technical Details breakdown */}
        {showTechDetails && (
          <div className="mt-2.5 p-2.5 bg-[#131722]/80 border border-[#2a2e39] rounded-lg text-xs animate-in fade-in">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#787b86]">Summary Score: </span>
                <span className="font-mono font-bold text-white">{asset.technicals.score > 0 ? `+${asset.technicals.score}` : asset.technicals.score}</span>
              </div>
              <div>
                <span className="text-[#787b86]">RSI (14): </span>
                <span className="font-mono text-white">{asset.technicals.rsi}</span>
              </div>
              <div>
                <span className="text-[#787b86]">MACD: </span>
                <span className="font-mono text-white">{asset.technicals.macd}</span>
              </div>
              <div>
                <span className="text-[#787b86]">Stochastic %K: </span>
                <span className="font-mono text-white">{asset.technicals.stochK}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between text-[10px] text-[#787b86]">
              <span className="text-[#089981] font-semibold">{asset.technicals.buyCount} Buy</span>
              <span className="text-white font-semibold">{asset.technicals.neutralCount} Neutral</span>
              <span className="text-[#f23645] font-semibold">{asset.technicals.sellCount} Sell</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
