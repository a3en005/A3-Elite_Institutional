
import React from 'react';
import { QuarterPerformance } from '../../types';

interface GuidanceVarianceProps {
  performance: QuarterPerformance[];
}

const GuidanceVariance: React.FC<GuidanceVarianceProps> = ({ performance }) => {
  return (
    <div className="px-4 space-y-6">
      <div className="flex gap-2">
        <TabButton label="REVENUE" isActive />
        <TabButton label="EPS" />
        <TabButton label="MARGIN" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatsCard label="8Q BEAT RATE" value="75.0%" trendWidth="75%" />
        <StatsCard label="AVG. VARIANCE" value="+4.22%" subValue="8-period rolling avg" isPositive />
      </div>
      
      <div>
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="size-2 bg-primary rounded-full animate-pulse"></span>
          QOQ Guidance vs. Delivery
        </h3>
        
        <div className="overflow-hidden rounded-xl border border-white/5">
          <table className="w-full text-left bg-terminal-surface">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-4 text-[9px] font-black text-white/30 uppercase tracking-widest border-r border-white/5">Period</th>
                <th className="p-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Guidance</th>
                <th className="p-4 text-[9px] font-black text-white/30 uppercase tracking-widest">Delivery</th>
                <th className="p-4 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Var %</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[10px] tabular-nums">
              {performance.map((q, idx) => (
                <tr key={idx} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-black border-r border-white/5 text-white/80 uppercase">{q.period}</td>
                  <td className="p-4 text-white/40">{q.guidance}</td>
                  <td className="p-4 text-white">{q.delivery}</td>
                  <td className={`p-4 text-right font-black ${q.variance >= 0 ? 'text-primary' : 'text-ruby'}`}>
                    {q.variance >= 0 ? '+' : ''}{q.variance.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-[8px] font-black text-white/20 uppercase tracking-widest">
           <span>Historical Performance Sequence</span>
           <div className="flex gap-3">
             <span className="flex items-center gap-1"><div className="size-1.5 bg-primary rounded-full"></div> Beat</span>
             <span className="flex items-center gap-1"><div className="size-1.5 bg-ruby rounded-full"></div> Miss</span>
           </div>
        </div>
        <div className="flex gap-1.5">
           {performance.map((q, i) => (
             <div key={i} className={`h-1.5 flex-1 rounded-sm ${q.variance >= 0 ? 'bg-primary' : 'bg-ruby'}`}></div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
         <button className="h-12 border border-white/10 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
           <span className="material-symbols-outlined !text-lg">download</span> CSV EXPORT
         </button>
         <button className="h-12 bg-primary text-obsidian rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,244,123,0.2)]">
           <span className="material-symbols-outlined !text-lg">analytics</span> AI INSIGHT
         </button>
      </div>
    </div>
  );
};

const TabButton = ({ label, isActive }: { label: string, isActive?: boolean }) => (
  <button className={`flex-1 h-9 rounded-lg text-[9px] font-black tracking-widest transition-all ${isActive ? 'bg-primary text-obsidian' : 'bg-white/5 text-white/40 hover:text-white'}`}>
    {label}
  </button>
);

const StatsCard = ({ label, value, subValue, isPositive, trendWidth }: { label: string, value: string, subValue?: string, isPositive?: boolean, trendWidth?: string }) => (
  <div className="bg-[#0c0f10] border border-white/5 p-4 rounded-xl flex flex-col gap-1">
    <p className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">{label}</p>
    <p className={`text-2xl font-black font-mono tracking-tighter ${isPositive !== undefined ? (isPositive ? 'text-primary' : 'text-ruby') : 'text-white'}`}>
      {value}
    </p>
    {subValue && <p className="text-[8px] font-mono italic text-white/20">{subValue}</p>}
    {trendWidth && (
      <div className="w-full h-1 bg-white/5 rounded-full mt-2">
        <div className="h-full bg-primary" style={{ width: trendWidth }}></div>
      </div>
    )}
  </div>
);

export default GuidanceVariance;
