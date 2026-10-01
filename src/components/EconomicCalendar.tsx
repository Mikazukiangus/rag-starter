import React, { useState } from 'react';
import { Calendar, X, Filter, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { EconomicEvent } from '../types/market';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events }) => {
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH' | 'MED'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (impactFilter === 'ALL') return true;
    return ev.impact === impactFilter;
  });

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col shadow-lg flex-1">
      <div className="flex items-center justify-between border-b border-[#2a2e39]/80 pb-2.5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Today's Economic Calendar</span>
        </h2>
        <span className="text-[10px] text-[#787b86] font-mono">EST</span>
      </div>

      {/* Calendar Events List */}
      <div className="divide-y divide-[#2a2e39]/40 text-xs mt-2 font-medium">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="py-2.5 flex items-start justify-between gap-2 hover:bg-[#2a2e39]/30 rounded px-1 transition-colors cursor-pointer group"
          >
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-[#787b86]">
                  {event.time}
                </span>
                <span
                  className={`text-[9px] px-1 py-0.2 font-bold rounded ${
                    event.impact === 'HIGH'
                      ? 'bg-red-500/20 text-red-400'
                      : event.impact === 'MED'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-zinc-500/20 text-zinc-400'
                  }`}
                >
                  {event.impact}
                </span>
                <span className="font-semibold text-white group-hover:text-[#2962ff] transition-colors">
                  {event.title}
                </span>
              </div>
              <div className="text-[11px] text-[#787b86] mt-0.5">{event.subtitle}</div>
            </div>

            <div className="text-right text-[11px] shrink-0">
              {event.actual ? (
                <>
                  <div className="font-mono text-[#089981] font-bold num-tabular">
                    {event.actual}
                  </div>
                  <div className="text-[10px] text-[#787b86] num-tabular">
                    F: {event.forecast}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-mono text-[#787b86] font-bold">Upcoming</div>
                  <div className="text-[10px] text-[#787b86]">Prev: {event.previous}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Link to Full Calendar */}
      <div className="mt-auto pt-3 border-t border-[#2a2e39] text-center">
        <button
          onClick={() => setIsFullModalOpen(true)}
          className="text-xs text-[#2962ff] hover:underline font-semibold flex items-center justify-center gap-1 w-full cursor-pointer"
        >
          <span>View Full Economic Calendar</span>
          <span>→</span>
        </button>
      </div>

      {/* Event Details Quick Peek Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md bg-[#1e222d] border border-[#2a2e39] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{selectedEvent.flag}</span>
                  <span className="text-xs font-mono text-[#787b86]">{selectedEvent.time} EST</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 font-bold rounded ${
                      selectedEvent.impact === 'HIGH'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {selectedEvent.impact} IMPACT
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedEvent.title}</h3>
                <p className="text-xs text-[#787b86]">{selectedEvent.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-[#787b86] hover:text-white p-1 rounded-lg bg-[#2a2e39]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#131722] p-3 rounded-xl border border-[#2a2e39] text-center text-xs">
              <div>
                <span className="text-[10px] text-[#787b86] block">ACTUAL</span>
                <span className="font-mono font-bold text-[#089981] text-sm">
                  {selectedEvent.actual || '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#787b86] block">FORECAST</span>
                <span className="font-mono font-bold text-white text-sm">
                  {selectedEvent.forecast}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#787b86] block">PREVIOUS</span>
                <span className="font-mono font-bold text-[#787b86] text-sm">
                  {selectedEvent.previous}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#f0f3fa]/85 leading-relaxed bg-[#2a2e39]/30 p-3 rounded-lg border border-[#2a2e39]/50">
              <span className="font-semibold text-white block mb-1">Market Significance:</span>
              {selectedEvent.analysis}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 bg-[#2962ff] text-white text-xs font-semibold rounded-lg hover:bg-[#2962ff]/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Economic Calendar Modal */}
      {isFullModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-3xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Global Economic Calendar</span>
                </h2>
                <p className="text-xs text-[#787b86]">
                  Real-time economic releases, monetary meetings, and central bank commentary
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter */}
                <div className="flex items-center bg-[#131722] p-1 rounded-lg text-xs">
                  {(['ALL', 'HIGH', 'MED'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setImpactFilter(filter)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        impactFilter === filter
                          ? 'bg-[#2a2e39] text-white font-semibold'
                          : 'text-[#787b86] hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsFullModalOpen(false)}
                  className="text-[#787b86] hover:text-white p-1.5 rounded-lg bg-[#2a2e39]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto mt-4 divide-y divide-[#2a2e39]/50 flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[#787b86] border-b border-[#2a2e39] uppercase font-semibold text-[11px]">
                    <th className="py-2.5 pl-2">Time (EST)</th>
                    <th className="py-2.5">Impact</th>
                    <th className="py-2.5">Event</th>
                    <th className="py-2.5 text-right">Actual</th>
                    <th className="py-2.5 text-right">Forecast</th>
                    <th className="py-2.5 text-right pr-2">Previous</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2e39]/40">
                  {filteredEvents.map((ev) => (
                    <tr
                      key={ev.id}
                      onClick={() => {
                        setSelectedEvent(ev);
                      }}
                      className="hover:bg-[#2a2e39]/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pl-2 font-mono text-[#787b86]">{ev.time}</td>
                      <td className="py-3">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 font-bold rounded ${
                            ev.impact === 'HIGH'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ev.impact}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-white">
                        <div>{ev.title}</div>
                        <div className="text-[11px] text-[#787b86]">{ev.subtitle}</div>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#089981]">
                        {ev.actual || '—'}
                      </td>
                      <td className="py-3 text-right font-mono text-white">
                        {ev.forecast}
                      </td>
                      <td className="py-3 text-right pr-2 font-mono text-[#787b86]">
                        {ev.previous}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2a2e39] flex justify-between items-center text-xs text-[#787b86]">
              <span>Times formatted in US Eastern Standard Time (EST)</span>
              <button
                onClick={() => setIsFullModalOpen(false)}
                className="px-4 py-1.5 bg-[#2962ff] text-white font-semibold rounded-lg hover:bg-[#2962ff]/90 transition-colors"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
