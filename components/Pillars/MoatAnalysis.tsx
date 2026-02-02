
import React from 'react';
import { MoatMetrics } from '../../types';

interface MoatAnalysisProps {
  metrics: MoatMetrics;
}

const MoatAnalysis: React.FC<MoatAnalysisProps> = ({ metrics }) => {
  const points = [
    { label: 'BRAND', value: metrics.brand },
    { label: 'PRICING', value: metrics.pricing },
    { label: 'R&D', value: metrics.rd },
    { label: 'NETWORK', value: metrics.network },
    { label: 'SWITCHING', value: metrics.switching },
  ];

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (value / 10) * 85;
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
  };

  const polygonPoints = points.map((p, i) => getCoordinates(i, p.value)).join(' ');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Competitive Moat Analysis</h2>
        <p className="text-primary text-[10px] font-mono tracking-widest mt-1 uppercase">RATING: WIDE MOAT ({(Object.values(metrics).reduce((a,b)=>a+b,0)/5).toFixed(1)}/10)</p>
      </div>

      <div className="relative flex justify-center py-12">
        <svg viewBox="0 0 200 200" className="w-full max-w-[340px]">
          {/* Axis lines and background polygons */}
          {[2, 4, 6, 8, 10].map(scale => (
             <polygon 
              key={scale}
              points={points.map((_, i) => getCoordinates(i, scale)).join(' ')} 
              fill="none" 
              stroke="rgba(255,255,255,0.03)" 
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          ))}
          
          {points.map((_, i) => {
            const end = getCoordinates(i, 10);
            return <line key={i} x1="100" y1="100" x2={end.split(',')[0]} y2={end.split(',')[1]} stroke="rgba(255,255,255,0.05)" />;
          })}

          <polygon 
            points={polygonPoints} 
            fill="rgba(37, 244, 123, 0.08)" 
            stroke="#25f47b" 
            strokeWidth="2.5"
          />

          {points.map((p, i) => {
            const [x, y] = getCoordinates(i, p.value).split(',');
            return <circle key={i} cx={x} cy={y} r="3" fill="#25f47b" />;
          })}
        </svg>

        {/* Dynamic Labels */}
        <div className="absolute top-0 text-[10px] font-black text-primary uppercase tracking-widest">BRAND</div>
        <div className="absolute top-[40%] -right-4 text-[10px] font-black text-white/40 uppercase tracking-widest">PRICING</div>
        <div className="absolute bottom-4 right-12 text-[10px] font-black text-white/40 uppercase tracking-widest">R&D</div>
        <div className="absolute bottom-4 left-12 text-[10px] font-black text-white/40 uppercase tracking-widest">NETWORK</div>
        <div className="absolute top-[40%] -left-4 text-[10px] font-black text-white/40 uppercase tracking-widest">SWITCHING</div>
      </div>

      {/* Executive Summary Console */}
      <div className="bg-[#0c0f10] border border-white/5 rounded-xl p-5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[8px] font-mono text-white/20 tracking-tighter uppercase">REF: ANLYST-SEC-921</p>
          <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 font-black tracking-widest">PRIORITY: HIGH</span>
        </div>
        <h4 className="flex items-center gap-2 text-[11px] font-black text-white uppercase tracking-[0.15em] mb-4">
           <span className="material-symbols-outlined !text-sm text-primary">description</span>
           Executive Summary
        </h4>
        <div className="space-y-3 font-mono text-[10px] text-white/60 leading-relaxed">
           <p>&gt; AI dominance continues to expand hardware moat. CUDA ecosystem provides extreme switching costs for enterprise dev stacks.</p>
           <p>&gt; Brand power remains at historical peaks, allowing for &gt;50% gross margin maintenance despite competitor entry.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricTrack label="BRAND" value={metrics.brand} />
        <MetricTrack label="PRICING" value={metrics.pricing} />
        <MetricTrack label="R&D" value={metrics.rd} />
      </div>

      <div className="bg-emerald/5 border border-emerald/20 p-4 rounded-xl flex items-start gap-3">
         <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full !text-lg">info</span>
         <div>
            <h5 className="text-[10px] font-black text-primary uppercase tracking-widest">Critical Signal</h5>
            <p className="text-[10px] font-mono text-white/50 leading-tight mt-1">Increased regulatory scrutiny in EU poses moderate risk to 'Regulatory Barrier' score.</p>
         </div>
      </div>
    </div>
  );
};

const MetricTrack = ({ label, value }: { label: string, value: number }) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-white font-mono">{value.toFixed(1)}</p>
    <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-primary" style={{ width: `${value * 10}%` }}></div>
    </div>
  </div>
);

export default MoatAnalysis;
