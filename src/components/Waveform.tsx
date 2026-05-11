import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface WaveformProps {
  isAnimating: boolean;
  levels?: number[];
  color?: string;
  barCount?: number;
  className?: string;
}

const Waveform: React.FC<WaveformProps> = ({ 
  isAnimating, 
  levels,
  color = "bg-brand-primary", 
  barCount = 12,
  className 
}) => {
  // If actual levels are provided, use them. Otherwise, use random animation if isAnimating.
  const displayLevels = levels || (isAnimating ? Array.from({ length: barCount }, () => Math.random()) : Array.from({ length: barCount }, () => 0));

  return (
    <div className={cn("flex items-center gap-1.5 h-10 px-2", className)}>
      {displayLevels.map((level, i) => (
        <motion.div
          key={i}
          initial={{ height: 4 }}
          animate={{ 
            height: isAnimating ? Math.max(4, level * 32) : 4,
            opacity: isAnimating ? Math.max(0.3, level) : 0.2,
          }}
          transition={{ 
            type: "spring",
            bounce: 0.4,
            duration: 0.1
          }}
          className={cn("w-1.5 rounded-full shadow-sm", color)}
          style={{
            background: `linear-gradient(to top, var(--color-brand-primary), var(--color-brand-secondary))`
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
