
import React from 'react';
import { SimulationState } from '../types';

interface PhysicsControlsProps {
  state: SimulationState;
  setState: React.Dispatch<React.SetStateAction<SimulationState>>;
}

const PhysicsControls: React.FC<PhysicsControlsProps> = ({ state, setState }) => {
  const updateParam = (key: keyof SimulationState, value: number) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <ControlSlider 
        label="Mass (m)" 
        unit="kg" 
        min={0.5} 
        max={10.0} 
        step={0.1} 
        value={state.mass} 
        onChange={(val) => updateParam('mass', val)}
        color="bg-blue-500"
      />
      <ControlSlider 
        label="Spring Constant (k)" 
        unit="N/m" 
        min={5} 
        max={100} 
        step={1} 
        value={state.springConstant} 
        onChange={(val) => updateParam('springConstant', val)}
        color="bg-emerald-500"
      />
      <ControlSlider 
        label="Amplitude (A)" 
        unit="m" 
        min={10} 
        max={120} 
        step={1} 
        value={state.amplitude} 
        onChange={(val) => updateParam('amplitude', val)}
        color="bg-amber-500"
      />
    </div>
  );
};

interface SliderProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  color: string;
}

const ControlSlider: React.FC<SliderProps> = ({ label, unit, min, max, step, value, onChange, color }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-white font-bold math-font">
          {value.toFixed(1)} <span className="text-slate-500 font-normal">{unit}</span>
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-${color.split('-')[1]}-500`}
      />
    </div>
  );
};

export default PhysicsControls;
