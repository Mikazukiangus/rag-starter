import React, { useState } from 'react';
import { Search, Globe, ChevronDown, User, Sparkles, SlidersHorizontal, BarChart3, TrendingUp, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  onOpenScreener: () => void;
  onOpenHeatmap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  activeNavTab,
  setActiveNavTab,
  onOpenScreener,
  onOpenHeatmap,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');

  return (
    <header className="w-full bg-[#131722] border-b border-[#2a2e39] sticky top-0 z-50 px-4 h-14 flex items-center justify-between">
      {/* Left branding & Primary Navigation */}
      <div className="flex items-center gap-6">
        {/* TradingView Geometric Logo */}
        <button
          onClick={() => setActiveNavTab('Markets')}
          aria-label="TradingView Home"
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <svg className="w-8 h-6 text-white group-hover:text-blue-400 transition-colors" viewBox="0 0 36 28" fill="currentColor">
            <path d="M14 22H7V6h7v16zm8-11h-5v11h5V11zm11-5h-8v16h8V6z" fill="currentColor" />
            <circle cx="3.5" cy="19.5" r="3.5" fill="#2962ff" />
          </svg>
        </button>

        {/* Quick Search Pill Input */}
        <div className="relative hidden md:flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787b86]">
            <Search className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={onOpenSearch}
            className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] text-left text-sm rounded-full pl-9 pr-14 py-1.5 w-60 lg:w-72 text-[#787b86] hover:text-[#f0f3fa] focus:outline-none transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Search (Ctrl+K)</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-tight bg-[#2a2e39] text-[#787b86] rounded border border-[#2a2e39]/80">
              ⌘K
            </span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveNavTab('Products')}
            className={`transition-colors py-4 ${activeNavTab === 'Products' ? 'text-white font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2962ff]' : 'text-[#787b86] hover:text-white'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveNavTab('Community')}
            className={`transition-colors py-4 ${activeNavTab === 'Community' ? 'text-white font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2962ff]' : 'text-[#787b86] hover:text-white'}`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveNavTab('Markets')}
            className={`transition-colors py-4 ${activeNavTab === 'Markets' ? 'text-white font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2962ff]' : 'text-[#787b86] hover:text-white'}`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveNavTab('Brokers')}
            className={`transition-colors py-4 ${activeNavTab === 'Brokers' ? 'text-white font-semibold relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2962ff]' : 'text-[#787b86] hover:text-white'}`}
          >
            Brokers
          </button>

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="text-[#787b86] hover:text-white transition-colors flex items-center gap-1 py-4"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {isMoreOpen && (
              <div
                className="absolute top-12 left-0 w-56 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl py-2 z-50 text-xs"
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button
                  onClick={() => {
                    onOpenScreener();
                    setIsMoreOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] flex items-center gap-2.5 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#2962ff]" />
                  <span>Stock Screener</span>
                </button>
                <button
                  onClick={() => {
                    onOpenHeatmap();
                    setIsMoreOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] flex items-center gap-2.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>S&P 500 Heatmap</span>
                </button>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] flex items-center gap-2.5 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Technical Analysis</span>
                </button>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] flex items-center gap-2.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pine Script Editor</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Right Utility Controls & Sign In */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden w-8 h-8 rounded-lg bg-[#1e222d] border border-[#2a2e39] flex items-center justify-center text-[#787b86] hover:text-white"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Currency / Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#1e222d] transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>EN / {currency}</span>
          </button>
          {isLangOpen && (
            <div
              className="absolute right-0 top-10 w-36 bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-xl py-1 z-50 text-xs"
              onMouseLeave={() => setIsLangOpen(false)}
            >
              {['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)'].map((curr) => {
                const code = curr.split(' ')[0];
                return (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#2a2e39] transition-colors ${currency === code ? 'text-[#2962ff] font-bold' : 'text-[#f0f3fa]'}`}
                  >
                    {curr}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-[#2a2e39] hover:bg-[#363a45] flex items-center justify-center text-[#787b86] hover:text-white transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          {isProfileOpen && (
            <div
              className="absolute right-0 top-10 w-48 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-xl py-2 z-50 text-xs"
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="px-3 py-1.5 border-b border-[#2a2e39] text-[#787b86]">
                Signed in as <strong className="text-white block truncate">carbonfibre@gmail.com</strong>
              </div>
              <button
                onClick={() => {
                  onOpenScreener();
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] transition-colors"
              >
                Watchlist & Screener
              </button>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] transition-colors"
              >
                Chart Layouts
              </button>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-3 py-2 hover:bg-[#2a2e39] text-[#f0f3fa] transition-colors"
              >
                Account Settings
              </button>
            </div>
          )}
        </div>

        {/* Gradient CTA Button */}
        <button
          onClick={() => setActiveNavTab('Markets')}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
