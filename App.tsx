
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Settings2, Info } from 'lucide-react';
import { SimulationState, PhysicsData, GraphPoint } from './types';
import LabCanvas from './components/LabCanvas';
import PhysicsControls from './components/PhysicsControls';
import DataDashboard from './components/DataDashboard';
import DisplacementGraph from './components/DisplacementGraph';
import TheorySection from './components/TheorySection';

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    mass: 2.0,
    springConstant: 10.0,
    amplitude: 50.0,
    time: 0,
    isRunning: false,
    isDragging: false,
    draggedX: 0,
  });

  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  // Derived physics values
  const omega = Math.sqrt(state.springConstant / state.mass);
  const period = 2 * Math.PI * Math.sqrt(state.mass / state.springConstant);
  
  const getCurrentPhysics = useCallback((): PhysicsData => {
    if (state.isDragging) {
      // While dragging, velocity and acceleration are effectively zero (or could be calculated, but simplified here)
      return {
        x: state.draggedX,
        v: 0,
        a: - (state.springConstant * state.draggedX) / state.mass,
        period,
        frequency: 1 / period,
        angularVelocity: omega,
        time: state.time,
        isDragging: true
      };
    }

    const t = state.time;
    const x = state.amplitude * Math.cos(omega * t);
    const v = -state.amplitude * omega * Math.sin(omega * t);
    const a = -state.amplitude * Math.pow(omega, 2) * Math.cos(omega * t);
    
    return {
      x, v, a,
      period,
      frequency: 1 / period,
      angularVelocity: omega,
      time: t,
      isDragging: false
    };
  }, [state.time, state.amplitude, state.isDragging, state.draggedX, state.springConstant, state.mass, omega, period]);

  const physics = getCurrentPhysics();

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      
      setState(prev => {
        if (!prev.isRunning || prev.isDragging) return prev;
        const newTime = prev.time + deltaTime;
        return { ...prev, time: newTime };
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Update graph data periodically
  useEffect(() => {
    if (state.isRunning && !state.isDragging) {
      const interval = setInterval(() => {
        setGraphData(prev => {
          const newData = [...prev, { time: Number(state.time.toFixed(2)), displacement: Number(physics.x.toFixed(2)) }];
          return newData.slice(-100);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state.isRunning, state.isDragging, state.time, physics.x]);

  const handleReset = () => {
    setState(prev => ({ ...prev, time: 0, isRunning: false, isDragging: false }));
    setGraphData([]);
  };

  const toggleRunning = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleDragStart = () => {
    setState(prev => ({ ...prev, isDragging: true, draggedX: physics.x }));
  };

  const handleDragMove = (newX: number) => {
    setState(prev => ({ ...prev, draggedX: newX }));
  };

  const handleDragEnd = (finalX: number) => {
    setState(prev => ({ 
      ...prev, 
      isDragging: false, 
      amplitude: finalX, 
      time: 0, 
      isRunning: true // Resume oscillation on release
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-950 text-slate-100">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            SHM Physics Lab
          </h1>
          <p className="text-slate-400 mt-1">Interactive Simple Harmonic Motion Simulator</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleRunning}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg ${
              state.isRunning 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            }`}
          >
            {state.isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-full font-bold transition-all border border-slate-700"
          >
            <RotateCcw size={20} /> Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-4 left-6 flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold pointer-events-none">
              <Activity size={14} className="text-blue-400" />
              {state.isDragging ? 'Adjusting Displacement...' : 'Live Simulation'}
            </div>
            <LabCanvas 
              physics={physics} 
              amplitude={state.amplitude} 
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-6 text-slate-300 font-bold uppercase tracking-wider text-sm">
                <Settings2 size={18} className="text-emerald-400" />
                Parameters
              </div>
              <PhysicsControls state={state} setState={setState} />
            </div>
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-6 text-slate-300 font-bold uppercase tracking-wider text-sm">
                <Activity size={18} className="text-amber-400" />
                Displacement Plot
              </div>
              <div className="h-64">
                <DisplacementGraph data={graphData} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <DataDashboard physics={physics} />
          <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
             <div className="flex items-center gap-2 mb-6 text-slate-300 font-bold uppercase tracking-wider text-sm">
                <Info size={18} className="text-blue-400" />
                Theory & Formulas
              </div>
              <TheorySection />
          </div>
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        Physics Simulation Engine v1.1 • Drag the block to set initial displacement
      </footer>
    </div>
  );
};

export default App;
