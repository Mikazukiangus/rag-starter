import React, { useState } from 'react';
import { Newspaper, X, ExternalLink, Clock, Tag } from 'lucide-react';
import { NewsArticle } from '../types/market';

interface TopMarketNewsProps {
  news: NewsArticle[];
  onSelectTicker?: (ticker: string) => void;
}

export const TopMarketNews: React.FC<TopMarketNewsProps> = ({ news, onSelectTicker }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col shadow-lg">
      <div className="flex items-center justify-between border-b border-[#2a2e39]/80 pb-2.5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <span>Top Market News</span>
        </h2>
        <span className="text-[10px] text-[#787b86] font-mono tracking-wider font-semibold">
          LIVE
        </span>
      </div>

      <div className="divide-y divide-[#2a2e39]/40 mt-1">
        {news.slice(0, 3).map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="py-2.5 hover:bg-[#2a2e39]/30 rounded px-1 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-[10px] text-[#787b86] mb-1">
              <span className="font-semibold text-white/90">{article.source}</span>
              <span>•</span>
              <span>{article.timeAgo}</span>
            </div>
            <h3 className="text-xs font-medium text-[#f0f3fa] group-hover:text-[#2962ff] leading-snug transition-colors">
              {article.headline}
            </h3>
          </article>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-lg bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#2a2e39] pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#787b86] mb-1">
                  <span className="font-bold text-white px-2 py-0.5 bg-[#2a2e39] rounded">
                    {selectedArticle.source}
                  </span>
                  <span>{selectedArticle.timestamp}</span>
                  <span>· {selectedArticle.readTime}</span>
                </div>
                <h2 className="text-base font-bold text-white leading-tight">
                  {selectedArticle.headline}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#787b86] hover:text-white p-1 rounded-lg bg-[#2a2e39]/50 hover:bg-[#2a2e39]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 text-xs text-[#f0f3fa]/90 space-y-3 leading-relaxed">
              <div className="p-3 bg-[#131722] rounded-xl border border-[#2a2e39] text-[#f0f3fa] font-medium">
                {selectedArticle.summary}
              </div>

              {selectedArticle.fullBody.split('\n\n').map((para, i) => (
                <p key={i} className="text-[#f0f3fa]/80">
                  {para}
                </p>
              ))}

              <div className="pt-3 border-t border-[#2a2e39]">
                <div className="text-[11px] text-[#787b86] font-semibold mb-2">
                  Mentioned Tickers:
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedArticle.relatedTickers.map((ticker) => (
                    <button
                      key={ticker}
                      onClick={() => {
                        onSelectTicker?.(ticker);
                        setSelectedArticle(null);
                      }}
                      className="px-2.5 py-1 bg-[#2a2e39] hover:bg-[#363a45] text-white rounded-md text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-[#2962ff]" />
                      <span>{ticker}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2a2e39] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 bg-[#2962ff] text-white text-xs font-semibold rounded-lg hover:bg-[#2962ff]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
