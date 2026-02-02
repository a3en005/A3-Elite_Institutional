
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { PricePoint, PeerValuation, InstitutionalFlow } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptionsBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0c0f10',
      titleColor: '#25f47b',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 10,
      titleFont: { family: 'JetBrains Mono', size: 10 },
      bodyFont: { family: 'JetBrains Mono', size: 10 }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 9, family: 'JetBrains Mono' } }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 9, family: 'JetBrains Mono' } }
    }
  }
};

export const PriceTrendChart: React.FC<{ data: PricePoint[] }> = ({ data }) => {
  const chartData = {
    labels: data.map(p => p.date),
    datasets: [{
      label: 'Trajectory',
      data: data.map(p => p.price),
      borderColor: '#25f47b',
      backgroundColor: 'rgba(37, 244, 123, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2
    }]
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border p-4 rounded-xl h-[260px]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">monitoring</span>
          Pillar 2: 5-Year Trend Trajectory
        </h4>
      </div>
      <div className="h-full pb-10">
        <Line options={chartOptionsBase} data={chartData} />
      </div>
    </div>
  );
};

export const ValuationBarChart: React.FC<{ data: PeerValuation[] }> = ({ data }) => {
  const chartData = {
    labels: data.map(p => p.name),
    datasets: [
      {
        label: 'P/E Ratio',
        data: data.map(p => p.pe),
        backgroundColor: '#25f47b',
      }
    ]
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border p-4 rounded-xl h-[240px]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">balance</span>
          Pillar 4: Valuation vs Peers
        </h4>
      </div>
      <div className="h-full pb-8">
        <Bar options={chartOptionsBase} data={chartData} />
      </div>
    </div>
  );
};

export const InstitutionalFlowChart: React.FC<{ data: InstitutionalFlow[] }> = ({ data }) => {
  const chartData = {
    labels: data.map(p => p.label),
    datasets: [{
      data: data.map(p => p.percentage),
      backgroundColor: ['#25f47b', 'rgba(37, 244, 123, 0.6)', 'rgba(37, 244, 123, 0.3)', 'rgba(255, 255, 255, 0.1)'],
      borderColor: '#0c0f10',
      borderWidth: 2
    }]
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border p-4 rounded-xl h-[240px]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">hub</span>
          Pillar 6: Institutional Flow
        </h4>
      </div>
      <div className="h-full pb-8 flex items-center justify-center">
        <Doughnut options={{ ...chartOptionsBase, cutout: '75%' }} data={chartData} />
      </div>
    </div>
  );
};
