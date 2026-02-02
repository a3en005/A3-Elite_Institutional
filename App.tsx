
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { NavigationTab, ResearchData } from './types';
import { getEquityResearch, startA3Chat } from './services/geminiService';
import MoatAnalysis from './components/Pillars/MoatAnalysis';
import GuidanceVariance from './components/Pillars/GuidanceVariance';
import VerdictEngine from './components/Pillars/VerdictEngine';
import { PriceTrendChart } from './components/Pillars/Charts';

const POPULAR_TICKERS = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'BTC', 'ETH'];

const MOCK_RESEARCH: ResearchData = {
  ticker: 'NVDA:NASDAQ',
  price: 822.79,
  change: 3.5,
  marketCap: '$2.06T',
  sector: 'Semiconductors',
  beatRate: 87.5,
  avgVariance: 6.12,
  lastUpdated: new Date().toLocaleTimeString(),
  p1_moat: { brand: 9.8, pricing: 9.2, rd: 10.0, network: 9.5, switching: 9.2 },
  p2_trends: Array.from({length: 12}, (_, i) => ({ date: `D${i}`, price: 700 + Math.random() * 200 })),
  p3_variance: [
    { period: "Q4 '23", guidance: "20.0B", delivery: "22.1B", variance: 10.5 },
    { period: "Q3 '23", guidance: "16.0B", delivery: "18.1B", variance: 13.1 },
    { period: "Q2 '23", guidance: "11.0B", delivery: "13.5B", variance: 22.7 },
    { period: "Q1 '23", guidance: "6.5B", delivery: "7.19B", variance: 10.6 },
  ],
  p4_valuation: [{ name: 'NVDA', pe: 72.4, peg: 1.2, ps: 38.2 }],
  p5_management: "Management remains focused on H200 ramp and software moat.",
  p6_flow: [{ label: 'Vanguard', percentage: 8.4 }, { label: 'BlackRock', percentage: 6.2 }],
  p7_macro: "AI supercycle fueling global compute demand.",
  p8_benchmarking: "Dominates >90% of data center training market.",
  p9_liquidity: "Infinite liquidity. Deep block trade nodes.",
  p10_esg: "Focus on energy-efficient compute nodes.",
  p11_verdict: {
    label: "STRONGLY BULLISH",
    confidence: 94,
    score: 84,
    sentimentScore: 84,
    sentimentDrivers: ["CUDA adoption peak", "Data center demand ramp", "GTC announcements"],
    analystConsensus: "Strong Buy"
  },
  summary: "AI dominance continues to expand hardware moat. CUDA ecosystem provides extreme switching costs.",
  recentNews: [
    { headline: "NVIDIA Unveils Blackwell Platform for Generative AI", source: "MarketNode", time: "1h ago" }
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [researchData, setResearchData] = useState<ResearchData>(MOCK_RESEARCH);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const performAnalysis = async (ticker: string) => {
    setIsLoading(true);
    try {
      const data = await getEquityResearch(ticker);
      setResearchData(data);
      setActiveTab(NavigationTab.RESEARCH);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = startA3Chat(isDeepAnalysis);
      }
      const response = await chatRef.current.sendMessage({ message: chatInput });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Connection failure." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Node Error: Failed to receive response." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleMode = () => {
    setIsDeepAnalysis(!isDeepAnalysis);
    chatRef.current = null;
    setChatMessages([]);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      title={activeTab === NavigationTab.DASHBOARD ? "EXECUTIVE SUMMARY" : "RESEARCH TERMINAL"}
    >
      {activeTab === NavigationTab.DASHBOARD && (
        <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Dashboard Sentiment Section - Screenshot Fidelity Implementation */}
          <div className="bg-[#0c0f10] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden glass-card shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-[11px] font-black text-primary tracking-[0.5em] uppercase mb-3">GLOBAL SENTIMENT</h3>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter leading-[0.9] uppercase">
                    STRONGLY<br/><span className="text-white">BULLISH</span>
                  </h2>
                </div>
                <div className="bg-primary/10 border border-primary/40 px-5 py-2 rounded-xl flex items-center gap-3">
                   <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#25f47b]"></div>
                   <span className="text-primary font-mono font-black text-lg tracking-widest">84/100</span>
                </div>
             </div>

             {/* Screenshot-styled Diagonal Gauge */}
             <div className="relative h-64 w-full flex items-center justify-center mb-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#121618] to-transparent rounded-[2rem] overflow-hidden border border-white/5">
                   {/* Grid Background */}
                   <div className="absolute inset-0 terminal-grid opacity-20"></div>
                   
                   <div className="absolute bottom-6 left-8 text-[11px] font-black text-ruby/40 tracking-[0.3em] uppercase">FEAR</div>
                   <div className="absolute bottom-6 right-8 text-[11px] font-black text-primary/40 tracking-[0.3em] uppercase">GREED</div>
                   
                   {/* Diagonal Axis */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[12px] bg-white/[0.03] rotate-[-25deg]">
                      <div className="h-full bg-primary shadow-[0_0_30px_#25f47b] w-[84%] transition-all duration-1500 cubic-bezier(0.19, 1, 0.22, 1)"></div>
                      
                      {/* Interactive Pointer Point */}
                      <div className="absolute top-1/2 left-[84%] -translate-y-1/2 flex items-center justify-center">
                         <div className="size-8 bg-white/20 rounded-full backdrop-blur-md border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.4)]"></div>
                         <div className="absolute size-4 bg-white rounded-full shadow-[0_0_20px_white]"></div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab(NavigationTab.RESEARCH)}
                  className="h-20 bg-primary text-obsidian rounded-3xl text-sm font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(37,244,123,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined !text-2xl">analytics</span>
                  FULL ANALYSIS
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-95 group"
                >
                  <span className="material-symbols-outlined !text-4xl group-hover:text-primary transition-colors">voice_chat</span>
                </button>
             </div>
          </div>

          {/* Proprietary Metrics Grid - Dense Screenshot Layout */}
          <div>
            <div className="flex items-center gap-6 mb-8">
               <div className="flex-1 h-[1px] bg-white/10"></div>
               <h3 className="text-[11px] font-black text-white/30 tracking-[0.6em] uppercase">PROPRIETARY METRICS</h3>
               <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <PropMetricCard icon="speed" label="MOMENTUM" value="ACCELERATING" metric="0.82" color="text-primary" />
              <PropMetricCard icon="hub" label="INST. FLOW" value="NET LONG" metric="HIGH" color="text-primary" />
              <PropMetricCard icon="warning" label="VOLATILITY" value="HIGH RISK" metric="92%" color="text-ruby" />
              <PropMetricCard icon="water_drop" label="LIQUIDITY" value="DEEP POOLS" metric="+4.1B" color="text-primary" />
            </div>
          </div>
        </div>
      )}

      {activeTab === NavigationTab.RESEARCH && (
        <div className="p-6 space-y-12 pb-48">
           {/* High-Density Node Header */}
           <div className="bg-terminal-surface border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
                <div className="bg-primary/20 text-primary text-[9px] font-black px-2 py-1 rounded-md tracking-widest uppercase border border-primary/30">RESEARCH_ACTIVE</div>
             </div>
             
             <div className="flex items-center gap-8">
               <div className="size-24 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center shadow-inner">
                 <span className="material-symbols-outlined !text-6xl text-white/10">shield</span>
               </div>
               <div className="flex-1">
                 <div className="flex items-baseline gap-4 mb-1">
                   <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{researchData.ticker}</h2>
                   <div className="h-0.5 w-12 bg-primary"></div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="text-primary font-mono font-black text-2xl tracking-tighter">${researchData.price.toFixed(2)}</span>
                   <span className={`text-sm font-black font-mono ${researchData.change >= 0 ? 'text-primary' : 'text-ruby'}`}>
                     {researchData.change >= 0 ? '▲' : '▼'} {Math.abs(researchData.change)}%
                   </span>
                 </div>
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2">
                   {researchData.sector} · MARKET CAP: {researchData.marketCap}
                 </p>
               </div>
             </div>
           </div>

           <MoatAnalysis metrics={researchData.p1_moat} />
           <VerdictEngine {...researchData.p11_verdict} />
           <GuidanceVariance performance={researchData.p3_variance} />
        </div>
      )}

      {/* Institutional Chat UI Overhaul */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-stretch justify-end">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative w-full sm:w-[500px] bg-terminal-bg h-[95vh] sm:h-screen border-l border-white/10 flex flex-col shadow-[0_0_120px_rgba(0,0,0,1)] animate-in slide-in-from-right-10 duration-500">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#080a0b]">
              <div className="flex items-center gap-5">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(37,244,123,0.1)]">
                  <span className="material-symbols-outlined text-primary !text-3xl">psychology</span>
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">A3-Trade AI Node</h2>
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Institutional Sync v4.2</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/20 hover:text-white transition-all hover:rotate-90">
                <span className="material-symbols-outlined !text-4xl">close</span>
              </button>
            </div>

            <div className="px-8 py-6 bg-obsidian border-b border-white/5 flex gap-4">
              <button 
                onClick={toggleMode}
                className={`flex-1 h-14 rounded-2xl border flex flex-col items-center justify-center transition-all ${!isDeepAnalysis ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(37,244,123,0.2)]' : 'bg-white/[0.02] border-white/5 opacity-50'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Fast Pulse</span>
                <span className="text-[8px] font-mono opacity-60">Low Latency Flash</span>
              </button>
              <button 
                onClick={toggleMode}
                className={`flex-1 h-14 rounded-2xl border flex flex-col items-center justify-center transition-all ${isDeepAnalysis ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(37,244,123,0.2)]' : 'bg-white/[0.02] border-white/5 opacity-50'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Deep Analysis</span>
                <span className="text-[8px] font-mono opacity-60">Search-Grounded Pro</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-terminal-grid">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-10">
                  <div className="size-24 bg-white/[0.02] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5">
                    <span className="material-symbols-outlined !text-6xl text-white/20">terminal</span>
                  </div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Intelligence Port Initialized</h3>
                  <p className="text-[10px] font-mono text-white/40 leading-relaxed uppercase tracking-widest">
                    Ready for institutional query. Mode: {isDeepAnalysis ? 'PRO' : 'FAST'}.
                  </p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[90%] p-5 rounded-3xl font-mono text-[11px] leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                    ? 'bg-primary/10 border border-primary/30 text-primary rounded-tr-none' 
                    : 'bg-terminal-surface border border-white/10 text-white/80 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-terminal-surface border border-white/10 p-5 rounded-3xl rounded-tl-none flex gap-3">
                    <div className="size-2 bg-primary/30 rounded-full animate-bounce"></div>
                    <div className="size-2 bg-primary/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-2 bg-primary/30 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-8 border-t border-white/5 bg-[#080a0b]">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="EXECUTE ANALYTIC QUERY..."
                  className="w-full bg-obsidian border border-white/10 rounded-[1.5rem] px-8 py-6 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all pr-20 placeholder:text-white/10"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-3 hover:bg-primary/10 rounded-xl transition-all" 
                  disabled={!chatInput.trim() || isChatLoading}
                >
                  <span className="material-symbols-outlined !text-4xl">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-10">
          <div className="relative">
            <div className="size-40 border-2 border-primary/5 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
            <div className="absolute inset-6 border-b-2 border-primary/40 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary !text-6xl animate-pulse">radar</span>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h4 className="text-sm font-black text-primary animate-pulse tracking-[1em] uppercase">Synthesizing Pillars</h4>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Accessing Institutional Node-0x41B</p>
          </div>
        </div>
      )}
      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  );
};

const PropMetricCard = ({ icon, label, value, metric, color }: { icon: string, label: string, value: string, metric: string, color: string }) => (
  <div className="bg-[#0c0f10] border border-white/5 p-8 rounded-[3rem] flex flex-col gap-5 group hover:border-white/20 transition-all cursor-pointer shadow-2xl active:scale-95">
    <div className="flex justify-between items-start">
      <div className={`size-14 rounded-2xl ${color.replace('text-', 'bg-')}/10 border ${color.replace('text-', 'border-')}/20 flex items-center justify-center group-hover:bg-white/5 transition-all`}>
        <span className={`material-symbols-outlined ${color} !text-3xl`}>{icon}</span>
      </div>
      <div className="text-right">
        <span className={`${color} text-xs font-mono font-black tracking-[0.2em]`}>{metric}</span>
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-white/20 tracking-[0.4em] mb-2 uppercase">{label}</p>
      <p className="text-sm font-black text-white uppercase tracking-widest leading-none italic">{value}</p>
    </div>
  </div>
);

export default App;
