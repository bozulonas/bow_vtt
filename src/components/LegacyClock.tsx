import React, { useEffect, useRef } from 'react';

interface ClockProps {
  progress: number;
  segments: number;
  badClock?: boolean;
}

export const LegacyClock: React.FC<ClockProps> = ({ progress, segments, badClock = false }) => {
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clockRef.current && typeof window.jQuery === 'function') {
      const clock = window.d.clock({
        segments: segments,
        progress: progress,
        bad: badClock
      });
      window.jQuery(clockRef.current).append(clock);
    }
  }, [progress, segments, badClock]);

  return <div ref={clockRef} className="clocks" />;
}; 