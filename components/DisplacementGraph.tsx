
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraphPoint } from '../types';

interface DisplacementGraphProps {
  data: GraphPoint[];
}

const DisplacementGraph: React.FC<DisplacementGraphProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="#475569" 
          fontSize={10} 
          tickFormatter={(val) => `${val}s`}
          label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 10 }}
        />
        <YAxis 
          stroke="#475569" 
          fontSize={10} 
          label={{ value: 'x (m)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
          itemStyle={{ color: '#3b82f6' }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Line 
          type="monotone" 
          dataKey="displacement" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={false} 
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DisplacementGraph;
