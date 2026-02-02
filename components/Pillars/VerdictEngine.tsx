
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
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const scoreRotation = animate ? (score / 100) * 180 - 90 : -90;
  const confRotation = animate ? (confidence / 100) * 180 - 90 : -90;
  const isBullish = score > 50;
  const accentColor = isBullish ? '#25f47b' : '#FF4B4B';

  return (
    <div className="bg-terminal-surface border border-terminal-border relative overflow-hidden rounded-[2rem] p-8 shadow-2xl">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-[10px] text-primary font-black tracking-[0.5em] uppercase mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined !text-[14px] animate-pulse">radar</span>
            INSTITUTIONAL VERDICT
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-black uppercase tracking-tighter italic ${isBullish ? 'text-white' : 'text-ruby'}`}>
                {label}
              </span>
              <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                 <span className="text-[10px] text-white font-mono font-bold tracking-widest">{score}/100</span>
              </div>
            </div>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
              CONFIDENCE: <span className="text-white/60">{confidence}%</span> · CONSENSUS: <span className="text-white/60">{analystConsensus}</span>
            </p>
          </div>
        </div>
        <div className={`border-2 px-4 py-2 rounded-xl ${isBullish ? 'border-primary/40 bg-primary/5 text-primary' : 'border-ruby/40 bg-ruby/5 text-ruby'}`}>
          <span className="text-xs font-black uppercase tracking-widest">{isBullish ? 'ACCUMULATE' : 'LIQUIDATE'}</span>
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] flex flex-col items-center justify-end overflow-hidden mb-10 group">
        {/* Background Track - High Fidelity Visual Separation */}
        <div className="absolute bottom-0 w-80 h-80 rounded-full border-[24px] border-white/5 mask-top"></div>
        <div className="absolute bottom-0 w-[320px] h-[320px] rounded-full border-[2px] border-white/10 mask-top translate-y-[-10px]"></div>
        
        {/* Fill Layer */}
        <div 
          className={`absolute bottom-0 w-[320px] h-[320px] rounded-full border-[24px] ${isBullish ? 'border-primary' : 'border-ruby'} border-b-transparent border-l-transparent -rotate-45 mask-top transition-all duration-1000 ease-out`}
          style={{ 
            opacity: 0.1,
            transform: `rotate(${(score / 100) * 180 - 135}deg)` 
          }}
        ></div>
        
        {/* Confidence Needle (Secondary - Subtle, Ultra-Thin White) */}
        <div 
          className="absolute bottom-0 h-40 w-[1.5px] bg-white/40 origin-bottom z-10 transition-transform duration-1200 ease-in-out"
          style={{ transform: `rotate(${confRotation}deg)` }}
        >
          <div className="absolute -top-1 -left-[1.5px] size-1.5 bg-white rounded-full"></div>
          <div className="absolute -top-8 -left-10 w-20 text-[7px] font-mono text-white/30 uppercase text-center tracking-widest">Confidence</div>
        </div>

        {/* Score Needle (Primary - Vibrant, Thick, Shadowed) */}
        <div 
          className={`absolute bottom-0 h-40 w-[6px] ${isBullish ? 'bg-primary' : 'bg-ruby'} origin-bottom z-20 transition-transform duration-1000 cubic-bezier(0.19, 1, 0.22, 1)`}
          style={{ 
            transform: `rotate(${scoreRotation}deg)`,
            boxShadow: `0 0 40px ${accentColor}CC`
          }}
        >
          <div className={`absolute -top-3 -left-[2.5px] size-3 ${isBullish ? 'bg-primary' : 'bg-ruby'} rounded-full ring-4 ring-obsidian shadow-2xl`}></div>
        </div>

        {/* Center Hub */}
        <div className="absolute bottom-[-25px] size-20 bg-obsidian border-2 border-white/10 rounded-full z-30 flex items-center justify-center shadow-2xl">
          <div className={`size-5 rounded-full ${isBullish ? 'bg-primary' : 'bg-ruby'} animate-pulse shadow-[0_0_20px_${accentColor}]`}></div>
        </div>
      </div>

      <div className="mt-4 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Sentiment Intelligence</h4>
          <div className="space-y-3">
            {sentimentDrivers.map((driver, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
                <span className="material-symbols-outlined !text-[14px] text-primary/40 group-hover:text-primary transition-colors">analytics</span>
                <p className="text-[10px] font-mono text-white/70 uppercase leading-tight">{driver}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col justify-between">
           <p className="text-[11px] font-mono text-white/80 leading-relaxed italic">
             "Based on current Pillar mapping, the alpha signal suggests high-conviction positioning. Institutional flows are aligning with the Q3 guidance beat trajectory."
           </p>
           <button className="mt-4 w-full h-10 bg-primary text-obsidian rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,244,123,0.3)] hover:brightness-110 active:scale-95 transition-all">
              Execute Position Re-entry
           </button>
        </div>
      </div>

      <style>{`
        .mask-top {
          mask-image: linear-gradient(to top, transparent 15%, black 60%);
        }
      `}</style>
    </div>
  );
};

export default VerdictEngine;
