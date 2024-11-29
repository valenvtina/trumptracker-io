import React from 'react';
import { GaugeProps } from '../types/promise';

export const Gauge: React.FC<GaugeProps> = ({ score }) => {
  // Clamp the score between -100 and 100
  const clampedScore = Math.max(-100, Math.min(100, score));
  // Convert score to rotation angle (-90 to 90 degrees)
  const rotation = (clampedScore / 100) * 90;

  return (
    <div className="relative h-32 w-full">
      {/* Semi-circle background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-[calc(50%-0.5rem)]">
        <div className="w-full h-full rounded-t-full bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30"></div>
        <div className="absolute inset-0 rounded-t-full border-[5px] border-b-0 border-gray-700"></div>
      </div>
      
      {/* Center point */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800 border-2 border-gray-600 rounded-full z-10"></div>
      
      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-0.5 bg-blue-400 origin-bottom transition-transform duration-500 z-20"
        style={{ 
          height: 'calc(50% - 12px)',
          transform: `translateX(-50%) rotate(${rotation}deg)`
        }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400"></div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-2 w-full flex justify-between px-4 text-xs font-medium">
        <span className="text-red-400">-100</span>
        <span className="text-green-400">+100</span>
      </div>
    </div>
  );
};