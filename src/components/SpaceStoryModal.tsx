import React from 'react';
import { X, Rocket, Compass, Radio, Award, ExternalLink } from 'lucide-react';

interface SpaceStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpaceStoryModal: React.FC<SpaceStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const astronautImgSrc =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHFbnW-vjxhPgi-O6E7dYMk9hGtP9tqgoRti808WQUAXNns9JBqd2qWjso8TOEijyYigTrI0eYA_kKUSFhVoywvHRWhViYNWAePN-KWwlrMiMZWlqdFAADrhAYTq63ufXX5AFC7HmIp4SVSbxWGPhIAGIX-8E7OgodxwEkNgmo-rXHGEZHrA9gqEwpDnvacGV-6ADgQirHF5UGFluN88U8SOs2qRelaPQ312yfPI6E5tUG2DTIBXKz';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-950 via-[#131722] to-purple-950 p-6 border-b border-[#2a2e39]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#787b86] hover:text-white p-1.5 rounded-lg bg-[#2a2e39]/60 hover:bg-[#2a2e39] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2962ff] shadow-lg shrink-0">
              <img
                src={astronautImgSrc}
                alt="Scott Kidd Poteet"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
                <Rocket className="w-3.5 h-3.5" />
                <span>Polaris Dawn Spaceflight</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                TradingView In Orbit: Scott "Kidd" Poteet
              </h2>
              <p className="text-xs text-[#787b86]">
                Mission Pilot · USAF Lt. Col. (Ret.) · Commercial Astronaut
              </p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#f0f3fa]/85 leading-relaxed">
          {/* Mission Highlights */}
          <div className="grid grid-cols-3 gap-3 bg-[#131722] p-4 rounded-xl border border-[#2a2e39] text-center">
            <div>
              <span className="text-[10px] text-[#787b86] uppercase font-bold block mb-1">
                Apogee Altitude
              </span>
              <span className="text-base font-bold font-mono text-white">1,400.7 km</span>
              <span className="text-[10px] text-[#089981] block mt-0.5">Highest since Apollo</span>
            </div>
            <div>
              <span className="text-[10px] text-[#787b86] uppercase font-bold block mb-1">
                Historic EVA
              </span>
              <span className="text-base font-bold font-mono text-white">Spacewalk</span>
              <span className="text-[10px] text-blue-400 block mt-0.5">First Commercial EVA</span>
            </div>
            <div>
              <span className="text-[10px] text-[#787b86] uppercase font-bold block mb-1">
                Telemetry Link
              </span>
              <span className="text-base font-bold font-mono text-white">Optical Laser</span>
              <span className="text-[10px] text-purple-400 block mt-0.5">Starlink Space-to-Earth</span>
            </div>
          </div>

          <div className="space-y-3 text-[13px] text-[#f0f3fa]/90">
            <p>
              When the Dragon spacecraft soared into the Van Allen radiation belts during the historic Polaris Dawn mission, the crew carried humanity into the farthest reaches of Earth orbit reached in more than 50 years.
            </p>
            <p>
              As Mission Pilot, <strong>Scott "Kidd" Poteet</strong> monitored critical high-precision avionics, orbital mechanics, and thermal telemetry. Just like pilots in supersonic cockpits and astronauts orbiting at 28,000 km/h, modern traders and financial analysts rely on <em>clean, split-second, zero-latency visualization</em> to navigate complex environments.
            </p>
          </div>

          {/* Testimonial Quote */}
          <blockquote className="p-4 rounded-xl bg-[#2a2e39]/50 border-l-4 border-[#2962ff] italic text-xs text-white">
            "Whether you are tracking orbital vectors across apogee or managing risk across global capital markets, clarity is everything. You need charts that never blink, tools that give you immediate insight, and absolute focus."
            <footer className="mt-2 text-[11px] text-[#787b86] font-normal not-italic">
              — Scott "Kidd" Poteet, Polaris Dawn Mission Pilot
            </footer>
          </blockquote>

          {/* Key Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#131722]/80 border border-[#2a2e39]">
              <Compass className="w-4 h-4 text-[#2962ff] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-xs">Mission-Critical Telemetry</strong>
                <span className="text-[11px] text-[#787b86]">
                  Real-time streaming charts with millisecond execution discipline.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#131722]/80 border border-[#2a2e39]">
              <Radio className="w-4 h-4 text-[#089981] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-xs">Global Interconnectivity</strong>
                <span className="text-[11px] text-[#787b86]">
                  Synchronized live feeds connecting equities, FX, crypto, and macro indicators.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2e39] bg-[#131722] flex items-center justify-between">
          <span className="text-xs text-[#787b86]">Polaris Dawn × TradingView Feature Story</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2962ff] hover:bg-[#2962ff]/90 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
