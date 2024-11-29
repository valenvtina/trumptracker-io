import React, { useEffect, useState } from 'react';
import { GaugeProps } from '../types/promise';

export const SemiCircleGauge: React.FC<GaugeProps> = ({ score, highlight }) => {
  const [currentRotation, setCurrentRotation] = useState(0);
  
  // Clamp the score between -100 and 100
  const clampedScore = Math.max(-100, Math.min(100, score));
  // Convert score to rotation angle (-90 to 90 degrees)
  const targetRotation = (clampedScore / 100) * 90;
  
  useEffect(() => {
    // Animate the needle movement
    const startRotation = currentRotation;
    const endRotation = targetRotation;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    const animateNeedle = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const newRotation = startRotation + (endRotation - startRotation) * easedProgress;
      setCurrentRotation(newRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animateNeedle);
      }
    };
    
    requestAnimationFrame(animateNeedle);
  }, [targetRotation]);

  const highlightColor = highlight ? {
    positive: 'from-green-500/30 to-green-500/10',
    negative: 'from-red-500/30 to-red-500/10',
    neutral: 'from-yellow-500/30 to-yellow-500/10'
  }[highlight] : 'from-red-500/30 via-yellow-500/30 to-green-500/30';

  const needleColor = highlight ? {
    positive: 'bg-green-400',
    negative: 'bg-red-400',
    neutral: 'bg-yellow-400'
  }[highlight] : 'bg-blue-400';

  // Generate tick marks
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const value = -100 + i * 10;
    const angle = (value / 100) * 90;
    const isMajor = i % 5 === 0;
    const tickLength = isMajor ? 12 : 8;
    const tickWidth = isMajor ? 2 : 1;
    
    return (
      <div
        key={i}
        className={`absolute bottom-0 left-1/2 origin-bottom ${
          isMajor ? 'bg-gray-400' : 'bg-gray-500/50'
        }`}
        style={{
          width: `${tickWidth}px`,
          height: `${tickLength}px`,
          transform: `translateX(-50%) rotate(${angle}deg)`,
        }}
      />
    );
  });

  return (
    <div className="relative h-40 w-full mb-1">
      {/* Semi-circle background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-[calc(50%-0.25rem)]">
        <div className={`w-full h-full rounded-t-full bg-gradient-to-r ${highlightColor} transition-all duration-500`}>
          {/* Metallic border effect */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-b from-white/5 to-transparent" />
        </div>
        {/* Chrome-like border */}
        <div className="absolute inset-0 rounded-t-full border-[6px] border-b-0 border-gray-700/80 shadow-inner" />
      </div>

      {/* Tick marks */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] h-[calc(50%-0.5rem)]">
        {ticks}
      </div>

      {/* Value labels */}
      <div className="absolute bottom-4 w-full flex justify-between px-8 text-xs font-medium">
        <div className="relative">
          <span className="absolute -left-2 -top-6 px-1.5 py-0.5 bg-gray-800/90 rounded text-red-400 font-bold backdrop-blur-sm">
            -100
          </span>
        </div>
        <div className="relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-6 px-1.5 py-0.5 bg-gray-800/90 rounded text-yellow-400 font-bold backdrop-blur-sm">
            0
          </span>
        </div>
        <div className="relative">
          <span className="absolute -right-2 -top-6 px-1.5 py-0.5 bg-gray-800/90 rounded text-green-400 font-bold backdrop-blur-sm">
            +100
          </span>
        </div>
      </div>

      {/* Center point with metallic effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-700 shadow-lg z-20" />

      {/* Needle with metallic effect */}
      <div 
        className={`absolute bottom-3 left-1/2 ${needleColor} origin-bottom z-10 transition-transform duration-1000`}
        style={{ 
          width: '2px',
          height: 'calc(50% - 12px)',
          transform: `translateX(-50%) rotate(${currentRotation}deg)`,
          transformOrigin: 'bottom center',
          willChange: 'transform',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}
      >
        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 ${needleColor} rounded-full shadow-lg`} />
      </div>
    </div>
  );
};