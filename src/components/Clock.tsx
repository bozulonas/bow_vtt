import React, { useState } from 'react';

interface ClockProps {
  progress: number;
  segments: number;
  size?: number;
  color?: string;
  badClock?: boolean;
}

export const Clock: React.FC<ClockProps> = ({ 
  progress: initialProgress, 
  segments, 
  size = 300,
  color = '#61dafb',
  badClock = false
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const center = size / 2;
  const radius = size * 0.4;
  const strokeWidth = size * 0.05;

  const handleSliceClick = (index: number) => {
    // Fill up to clicked segment or clear if clicking filled segment
    setProgress(progress === index + 1 ? index : index + 1);
    
    // Play sound (you can add this later)
    // playSound('stone_on_stone_impact_loud1.mp3');
  };

  const createSlices = () => {
    const slices = [];
    const anglePerSegment = (2 * Math.PI) / segments;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * anglePerSegment - Math.PI / 2;
      const endAngle = startAngle + anglePerSegment;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArcFlag = anglePerSegment > Math.PI ? 1 : 0;
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={i < progress ? (badClock ? '#ff5555' : color) : 'transparent'}
          stroke="#666"
          strokeWidth={strokeWidth}
          onClick={() => handleSliceClick(i)}
          style={{ cursor: 'pointer' }}
          className="clock-slice"
        />
      );
    }
    return slices;
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      style={{ 
        backgroundColor: 'transparent',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
      }}
    >
      {createSlices()}
    </svg>
  );
}; 