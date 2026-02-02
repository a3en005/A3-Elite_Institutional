
import React, { useEffect, useState } from 'react';

interface VerdictEngineProps {
  label: string;
  confidence: number;
  score: number;
  sentimentScore?: number;
  sentimentDrivers?: string[];
  analystConsensus?: string;
}

const VerdictEngine: React.FC<VerdictEngineProps> = ({ 
  label, 
  confidence, 
  score, 
  sentimentScore = 50, 
  sentimentDrivers = [],
  analystConsensus = "N/A"
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const rotation = mounted ? (score / 100) * 180 - 90 : -90;
  const confRotation = mounted ? (confidence / 100) * 180 - 90 : -90;
  const isBullish = score > 50;

  return (
    <div className="bg-terminal-surface border border-terminal-border relative overflow-hidden rounded-xl p-6">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-[10px] text-primary font-bold tracking-[0.4em] uppercase mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined !text-[12px] animate-pulse">radar</span>
            Verdict Engine 360°
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-extrabold uppercase tracking-tighter italic ${isBullish ? 'text-white' : 'text-ruby'}`}>
                {label}
              </span>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Confidence: {confidence}%</span>
            </div>
            <p className="text-[9px] text-white/30 font-mono uppercase">Consensus: <span className="text-white/60">{analystConsensus}</span></p>
          </div>
        </div>
        <div className={`border px-3 py-1 ${isBullish ? 'border-primary/40 bg-primary/5 text-primary' : 'border-ruby/40 bg-ruby/5 text-ruby'}`}>
          <span className="text-xs font-black uppercase">{isBullish ? 'ACCUMULATE' : 'LIQUIDATE'}</span>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] flex flex-col items-center justify-end overflow-hidden mb-6 group">
        {/* Track - More pronounced visual separation */}
        <div className="absolute bottom-0 w-72 h-72 rounded-full border-[16px] border-white/5 mask-top"></div>
        <div className="absolute bottom-0 w-72 h-72 rounded-full border-[2px] border-white/10 mask-top translate-y-[-7px]"></div>
        
        {/* Fill */}
        <div 
          className={`absolute bottom-0 w-72 h-72 rounded-full border-[16px] ${isBullish ? 'border-primary' : 'border-ruby'} border-b-transparent border-l-transparent -rotate-45 mask-top transition-all duration-1000 ease-out`}
          style={{ 
            opacity: 0.2,
            transform: `rotate(${(score / 100) * 180 - 135}deg)` 
          }}
        ></div>
        
        {/* Confidence Needle (Secondary - Subtle, Thin, White) */}
        <div 
          className="absolute bottom-0 h-36 w-[1px] bg-white/60 origin-bottom z-10 transition-transform duration-1500 ease-in-out"
          style={{ transform: `rotate(${confRotation}deg)` }}
        >
          <div className="absolute -top-4 -left-[40px] w-20 text-[7px] font-mono text-white/40 uppercase -rotate-90 origin-center text-center">Conviction</div>
          <div className="absolute -top-1 -left-[1.5px] size-1 bg-white rounded-full"></div>
        </div>

        {/* Score Needle (Primary - Vibrant, Thick, Shadowed) */}
        <div 
          className={`absolute bottom-0 h-36 w-[4px] ${isBullish ? 'bg-primary' : 'bg-ruby'} origin-bottom z-20 transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            boxShadow: `0 0 20px ${isBullish ? 'rgba(37, 244, 123, 0.6)' : 'rgba(255, 75, 75, 0.6)'}`
          }}
        >
          <div className={`absolute -top-2 -left-[3px] size-2.5 ${isBullish ? 'bg-primary' : 'bg-ruby'} rounded-full shadow-lg`}></div>
        </div>

        {/* Center hub */}
        <div className="absolute bottom-[-15px] size-12 bg-obsidian border-[1px] border-white/20 rounded-full z-30 flex items-center justify-center shadow-xl">
          <div className={`size-3 rounded-full ${isBullish ? 'bg-primary' : 'bg-ruby'} animate-pulse`}></div>
        </div>
      </div>

      {/* Sentiment Analysis Section */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">News Sentiment Node</h4>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sentimentScore > 50 ? 'bg-primary/10 text-primary' : 'bg-ruby/10 text-ruby'}`}>
            SCORE: {sentimentScore}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {sentimentDrivers.map((driver, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded border border-white/5 hover:border-white/10 transition-colors">
              <span className="material-symbols-outlined !text-[12px] text-white/20 mt-0.5">news</span>
              <p className="text-[10px] font-mono text-white/60 leading-tight">{driver}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .mask-top {
          mask-image: linear-gradient(to top, transparent 10%, black 50%);
        }
      `}</style>
    </div>
  );
};

export default VerdictEngine;
