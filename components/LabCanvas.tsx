
import React, { useRef, useEffect, useState } from 'react';
import { PhysicsData } from '../types';

interface LabCanvasProps {
  physics: PhysicsData;
  amplitude: number;
  onDragStart: () => void;
  onDragMove: (newX: number) => void;
  onDragEnd: (finalX: number) => void;
}

const LabCanvas: React.FC<LabCanvasProps> = ({ physics, amplitude, onDragStart, onDragMove, onDragEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const draggingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scaling and constants
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const startX = 80; // Distance from left wall
    const restX = width / 2; // Equilibrium position
    const currentBlockX = restX + physics.x;
    const blockSize = 50;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Ground
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY + blockSize / 2 + 2);
      ctx.lineTo(width, centerY + blockSize / 2 + 2);
      ctx.stroke();

      // 2. Draw Grid Lines (Subtle)
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(restX, 0);
      ctx.lineTo(restX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Left Wall
      ctx.fillStyle = '#475569';
      ctx.fillRect(startX - 10, centerY - 60, 10, 120);

      // 4. Draw Spring
      ctx.strokeStyle = physics.isDragging ? '#60a5fa' : '#94a3b8';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      const numCoils = 25;
      const springWidth = currentBlockX - startX - blockSize / 2;
      const coilHeight = 20;

      ctx.moveTo(startX, centerY);
      for (let i = 0; i <= numCoils; i++) {
        const x = startX + (i / numCoils) * springWidth;
        const y = centerY + (i % 2 === 0 ? -coilHeight : coilHeight);
        
        if (i === 0 || i === numCoils) {
          ctx.lineTo(x, centerY);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 5. Draw Block
      const gradient = ctx.createLinearGradient(
        currentBlockX - blockSize / 2, 
        centerY - blockSize / 2, 
        currentBlockX + blockSize / 2, 
        centerY + blockSize / 2
      );
      
      if (physics.isDragging) {
        gradient.addColorStop(0, '#60a5fa');
        gradient.addColorStop(1, '#3b82f6');
      } else {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#2563eb');
      }
      
      ctx.fillStyle = gradient;
      ctx.shadowBlur = physics.isDragging ? 25 : 15;
      ctx.shadowColor = physics.isDragging ? 'rgba(96, 165, 250, 0.6)' : 'rgba(59, 130, 246, 0.4)';
      
      // Manual path for roundRect if not available (though standard now)
      ctx.beginPath();
      ctx.roundRect(
        currentBlockX - blockSize / 2, 
        centerY - blockSize / 2, 
        blockSize, 
        blockSize, 
        8
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. Draw Equilibrium Label
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('EQUILIBRIUM (x=0)', restX, centerY + 60);

      // 7. Draw Interaction Hint
      if (!physics.isDragging && isHovering) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter';
        ctx.fillText('DRAG TO SET START POSITION', currentBlockX, centerY - 40);
      }

      // 8. Draw Force Vectors
      if (Math.abs(physics.x) > 5) {
        const forceColor = physics.x > 0 ? '#ef4444' : '#10b981';
        ctx.strokeStyle = forceColor;
        ctx.fillStyle = forceColor;
        ctx.lineWidth = 2;
        
        const arrowStartX = currentBlockX;
        const arrowEndX = currentBlockX - (physics.x * 0.5);
        
        ctx.beginPath();
        ctx.moveTo(arrowStartX, centerY - (physics.isDragging ? 60 : 40));
        ctx.lineTo(arrowEndX, centerY - (physics.isDragging ? 60 : 40));
        ctx.stroke();
        
        const headSize = 6;
        ctx.beginPath();
        const direction = physics.x > 0 ? -1 : 1;
        ctx.moveTo(arrowEndX, centerY - (physics.isDragging ? 60 : 40));
        ctx.lineTo(arrowEndX - direction * headSize, centerY - (physics.isDragging ? 60 : 40) - headSize);
        ctx.lineTo(arrowEndX - direction * headSize, centerY - (physics.isDragging ? 60 : 40) + headSize);
        ctx.fill();
        
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('RESTORING FORCE', (arrowStartX + arrowEndX) / 2, centerY - (physics.isDragging ? 70 : 50));
      }
    };

    render();
  }, [physics, amplitude, isHovering]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const restX = canvas.width / 2;
    const currentBlockX = restX + physics.x;
    const blockSize = 50;

    // Check if click is on block
    if (
      mouseX >= currentBlockX - blockSize / 2 &&
      mouseX <= currentBlockX + blockSize / 2 &&
      mouseY >= canvas.height / 2 - blockSize / 2 &&
      mouseY <= canvas.height / 2 + blockSize / 2
    ) {
      draggingRef.current = true;
      onDragStart();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    const restX = canvas.width / 2;
    const currentBlockX = restX + physics.x;
    const blockSize = 50;

    // Update hover state
    const isOver = (
      mouseX >= currentBlockX - blockSize / 2 &&
      mouseX <= currentBlockX + blockSize / 2 &&
      mouseY >= canvas.height / 2 - blockSize / 2 &&
      mouseY <= canvas.height / 2 + blockSize / 2
    );
    setIsHovering(isOver);

    if (draggingRef.current) {
      const newDisplacement = mouseX - restX;
      // Clamp displacement to reasonable bounds
      const clampedX = Math.max(-150, Math.min(150, newDisplacement));
      onDragMove(clampedX);
    }
  };

  const handleMouseUp = () => {
    if (draggingRef.current) {
      draggingRef.current = false;
      onDragEnd(physics.x);
    }
  };

  return (
    <div className="w-full h-80 flex justify-center items-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={320} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full object-contain ${physics.isDragging ? 'cursor-grabbing' : isHovering ? 'cursor-grab' : 'cursor-default'}`}
      />
    </div>
  );
};

export default LabCanvas;
