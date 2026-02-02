
import React from 'react';
import { NavigationTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, title, subtitle }) => {
  return (
    <div className="h-screen flex flex-col font-display bg-terminal-bg selection:bg-primary/30 text-white">
      {/* Primary Header */}
      <header className="z-50 bg-terminal-bg border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-white/60">
            <span className="material-symbols-outlined !text-2xl">menu</span>
          </button>
          <div className="text-center">
            <h1 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] leading-none mb-1">
              A3-TRADE PRO
            </h1>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              {title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="size-2 rounded-full bg-primary shadow-[0_0_12px_#25f47b] animate-pulse"></div>
        </div>
      </header>

      {/* Macro Ticker Bar */}
      <div className="bg-[#080a0b] border-b border-white/5 px-6 py-2 flex justify-between items-center overflow-x-auto no-scrollbar whitespace-nowrap">
        <TickerItem label="NY-SESSION" value="OPEN" color="text-primary" />
        <TickerItem label="VIX" value="14.22" subValue="(-1.2%)" color="text-ruby" />
        <TickerItem label="DXY" value="104.1" subValue="(+0.04%)" color="text-primary" />
      </div>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {children}
      </main>

      {/* Pro Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#050708]/90 backdrop-blur-2xl border-t border-white/5 pt-3 pb-8 px-8 z-50 flex justify-between items-center">
        <NavButton 
          icon="grid_view" 
          label="SUMMARY" 
          isActive={activeTab === NavigationTab.DASHBOARD} 
          onClick={() => setActiveTab(NavigationTab.DASHBOARD)} 
        />
        <NavButton 
          icon="monitoring" 
          label="CHARTS" 
          isActive={activeTab === NavigationTab.FLOW} 
          onClick={() => setActiveTab(NavigationTab.FLOW)} 
        />
        
        <div className="relative -top-12">
          <button className="size-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,244,123,0.3)] active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-obsidian !text-4xl font-black">add</span>
          </button>
        </div>

        <NavButton 
          icon="analytics" 
          label="RESEARCH" 
          isActive={activeTab === NavigationTab.RESEARCH} 
          onClick={() => setActiveTab(NavigationTab.RESEARCH)} 
        />
        <NavButton 
          icon="person" 
          label="PROFILE" 
          isActive={activeTab === NavigationTab.SETTINGS} 
          onClick={() => setActiveTab(NavigationTab.SETTINGS)} 
        />
      </nav>
    </div>
  );
};

const TickerItem = ({ label, value, subValue, color }: { label: string, value: string, subValue?: string, color: string }) => (
  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
    <span className="text-white/40">{label}:</span>
    <span className={`${color} font-bold`}>{value}</span>
    {subValue && <span className={`${color} opacity-80 text-[9px]`}>{subValue}</span>}
  </div>
);

const NavButton = ({ icon, label, isActive, onClick }: { icon: string, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-white/40 hover:text-white'}`}
  >
    <span className={`material-symbols-outlined !text-2xl ${isActive ? 'fill-1' : ''}`}>{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1">{label}</span>
  </button>
);

export default Layout;
