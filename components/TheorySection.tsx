
import React from 'react';

const TheorySection: React.FC = () => {
  return (
    <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
      <section>
        <p>Simple Harmonic Motion is a periodic motion where the restoring force is directly proportional to the displacement.</p>
      </section>

      <section className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold uppercase text-xs">Angular Velocity</span>
          <span className="math-font text-blue-400">ω = √(k / m)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold uppercase text-xs">Time Period</span>
          <span className="math-font text-emerald-400">T = 2π√(m / k)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold uppercase text-xs">Position Equation</span>
          <span className="math-font text-amber-400">x(t) = A · cos(ωt)</span>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase mb-1">Position (x)</h4>
          <p>The distance from the equilibrium point. Max displacement = Amplitude (A).</p>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase mb-1">Velocity (v)</h4>
          <p>The rate of change of position. Max velocity occurs at x = 0.</p>
        </div>
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase mb-1">Acceleration (a)</h4>
          <p>Always directed towards equilibrium. Max acceleration occurs at extremes (x = ±A).</p>
        </div>
      </section>
    </div>
  );
};

export default TheorySection;
