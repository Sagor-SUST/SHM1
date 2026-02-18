
export interface SimulationState {
  mass: number; // kg
  springConstant: number; // N/m
  amplitude: number; // m
  time: number; // s
  isRunning: boolean;
  isDragging: boolean;
  draggedX: number; // Current displacement while dragging
}

export interface PhysicsData {
  x: number;
  v: number;
  a: number;
  period: number;
  frequency: number;
  angularVelocity: number;
  time: number;
  isDragging: boolean;
}

export interface GraphPoint {
  time: number;
  displacement: number;
}
