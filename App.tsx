
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { NavigationTab, ResearchData } from './types';
import { getEquityResearch, startA3Chat } from './services/geminiService';
import MoatAnalysis from './components/Pillars/MoatAnalysis';
import GuidanceVariance from './components/Pillars/GuidanceVariance';
import VerdictEngine from './components/Pillars/VerdictEngine';
import { PriceTrendChart, ValuationBarChart, InstitutionalFlowChart } from './components/Pillars/Charts';

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
    chatRef.current = null; // Reset chat session when switching modes
    setChatMessages([]);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      title={activeTab === NavigationTab.DASHBOARD ? "EXECUTIVE SUMMARY" : "RESEARCH TERMINAL"}
    >
      {activeTab === NavigationTab.DASHBOARD && (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Main Global Sentiment Card */}
          <div className="bg-[#0c0f10] border border-white/5 rounded-3xl p-8 relative overflow-hidden glass-card">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase mb-2">GLOBAL SENTIMENT</h3>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none uppercase">
                    STRONGLY<br/>BULLISH
                  </h2>
                </div>
                <div className="bg-primary/10 border border-primary/40 px-3 py-1 rounded-md">
                   <span className="text-primary font-mono font-bold text-sm">84/100</span>
                </div>
             </div>

             <div className="relative h-48 w-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[#121618] rounded-xl overflow-hidden border border-white/5">
                   <div className="absolute bottom-4 left-4 text-[9px] font-black text-ruby/50 tracking-widest uppercase">FEAR</div>
                   <div className="absolute bottom-4 right-4 text-[9px] font-black text-primary/50 tracking-widest uppercase">GREED</div>
                   
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[8px] bg-white/5 rotate-[-35deg]">
                      <div className="h-full bg-primary shadow-[0_0_20px_#25f47b] w-[84%] transition-all duration-1000"></div>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] w-full h-full flex items-center justify-center">
                      <div className="size-4 bg-white rounded-full border-4 border-obsidian shadow-[0_0_15px_white] translate-x-[120px]"></div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={() => setActiveTab(NavigationTab.RESEARCH)} className="h-16 bg-primary text-obsidian rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(37,244,123,0.3)]">
                  FULL ANALYSIS
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                  <span className="material-symbols-outlined !text-3xl">voice_chat</span>
                </button>
             </div>
          </div>

          {/* Proprietary Metrics Grid */}
          <div>
            <div className="flex items-center gap-4 mb-6">
               <div className="flex-1 h-[1px] bg-white/5"></div>
               <h3 className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">PROPRIETARY METRICS</h3>
               <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PropMetricCard icon="speed" label="MOMENTUM" value="ACCELERATING" metric="0.82" color="text-primary" />
              <PropMetricCard icon="hub" label="INST. FLOW" value="NET LONG" metric="HIGH" color="text-primary" />
              <PropMetricCard icon="warning" label="VOLATILITY" value="HIGH RISK" metric="92%" color="text-ruby" />
              <PropMetricCard icon="water_drop" label="LIQUIDITY" value="DEEP POOLS" metric="+4.1B" color="text-primary" />
            </div>
          </div>
        </div>
      )}

      {activeTab === NavigationTab.RESEARCH && (
        <div className="p-6 space-y-10 pb-40">
           <div className="flex items-center gap-4 mb-4">
             <button onClick={() => setActiveTab(NavigationTab.DASHBOARD)} className="text-white/40">
               <span className="material-symbols-outlined">arrow_back_ios</span>
             </button>
             <div className="flex-1">
               <div className="flex items-center gap-2">
                 <h2 className="text-xl font-black text-white font-mono tracking-tighter">NVDA:NASDAQ</h2>
                 <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 rounded tracking-widest uppercase">RESEARCH</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-primary font-black text-lg">$822.79</span>
                 <span className="text-primary text-[10px] font-bold">(+3.5%)</span>
               </div>
             </div>
           </div>

           <MoatAnalysis metrics={researchData.p1_moat} />
           <VerdictEngine {...researchData.p11_verdict} />
           <GuidanceVariance performance={researchData.p3_variance} />
        </div>
      )}

      {/* Institutional Chat Sidebar */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-stretch justify-end">
          <div className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative w-full sm:w-[450px] bg-terminal-surface h-[90vh] sm:h-screen border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right-10">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-terminal-bg">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">voice_chat</span>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">A3-Trade AI Node</h2>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="px-6 py-3 bg-white/5 flex gap-2 items-center">
              <button 
                onClick={toggleMode}
                className={`flex-1 h-8 rounded text-[9px] font-black transition-all ${!isDeepAnalysis ? 'bg-primary text-obsidian shadow-[0_0_10px_rgba(37,244,123,0.3)]' : 'bg-white/5 text-white/40'}`}
              >
                FAST PULSE
              </button>
              <button 
                onClick={toggleMode}
                className={`flex-1 h-8 rounded text-[9px] font-black transition-all ${isDeepAnalysis ? 'bg-primary text-obsidian shadow-[0_0_10px_rgba(37,244,123,0.3)]' : 'bg-white/5 text-white/40'}`}
              >
                DEEP ANALYSIS
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <span className="material-symbols-outlined !text-6xl mb-4">robot_2</span>
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Awaiting Command Input...</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl font-mono text-[11px] leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-primary/10 border border-primary/30 text-primary rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tl-none flex gap-2">
                    <div className="size-1 bg-primary rounded-full animate-bounce"></div>
                    <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-terminal-bg">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Query institutional engine..."
                  className="w-full bg-[#121618] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-primary/50 transition-all pr-12"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:opacity-30" disabled={!chatInput.trim() || isChatLoading}>
                  <span className="material-symbols-outlined !text-xl">send</span>
                </button>
              </div>
              <p className="mt-3 text-[8px] text-center font-mono text-white/20 uppercase tracking-widest">
                {isDeepAnalysis ? "Model: Gemini 3 Pro (Higher Intelligence)" : "Model: Gemini Flash Lite (Ultra Low Latency)"}
              </p>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-6">
          <div className="size-20 border-2 border-primary/20 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
            <span className="material-symbols-outlined text-primary !text-4xl animate-pulse">monitoring</span>
          </div>
          <p className="text-[10px] font-mono text-primary animate-pulse tracking-[0.6em] uppercase font-black">SYNCHRONIZING PILLARS</p>
        </div>
      )}
    </Layout>
  );
};

const PropMetricCard = ({ icon, label, value, metric, color }: { icon: string, label: string, value: string, metric: string, color: string }) => (
  <div className="bg-[#0c0f10] border border-white/5 p-5 rounded-3xl flex flex-col gap-3 group hover:border-white/10 transition-all cursor-pointer">
    <div className="flex justify-between items-start">
      <span className={`material-symbols-outlined ${color} bg-white/5 p-2 rounded-xl !text-xl`}>{icon}</span>
      <span className={`${color} text-[10px] font-mono font-bold`}>{metric}</span>
    </div>
    <div>
      <p className="text-[8px] font-black text-white/30 tracking-[0.2em] mb-1">{label}</p>
      <p className="text-[11px] font-black text-white uppercase tracking-widest">{value}</p>
    </div>
  </div>
);

export default App;
