
import React from 'react';
import { PhysicsData } from '../types';

interface DataDashboardProps {
  physics: PhysicsData;
}

const DataDashboard: React.FC<DataDashboardProps> = ({ physics }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard 
        label="Displacement (x)" 
        value={physics.x} 
        unit="m" 
        color="text-blue-400" 
      />
      <MetricCard 
        label="Velocity (v)" 
        value={physics.v} 
        unit="m/s" 
        color="text-emerald-400" 
      />
      <MetricCard 
        label="Acceleration (a)" 
        value={physics.a} 
        unit="m/s²" 
        color="text-rose-400" 
      />
      <MetricCard 
        label="Time (t)" 
        value={physics.time} 
        unit="s" 
        color="text-amber-400" 
      />
      <div className="col-span-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-1">Time Period (T)</span>
          <span className="text-2xl font-bold math-font">{physics.period.toFixed(3)}s</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-1">Frequency (f)</span>
          <span className="text-xl font-bold math-font text-slate-300">{physics.frequency.toFixed(2)} Hz</span>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, color }) => {
  return (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
      <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold math-font ${color}`}>{value.toFixed(2)}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
};

export default DataDashboard;
