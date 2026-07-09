import React from 'react';

interface InfiniteMarqueeProps {
  items: React.ReactNode[];
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  className?: string;
}

export default function InfiniteMarquee({
  items,
  speed = 'normal',
  direction = 'left',
  className = ''
}: InfiniteMarqueeProps) {

  const speedClass = {
    slow: 'duration-[60s]',
    normal: 'duration-[30s]',
    fast: 'duration-[15s]'
  };

  const directionClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';

  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div className={`whitespace-nowrap flex min-w-full shrink-0 items-center justify-around gap-8 ${directionClass} ${speedClass[speed]}`}>
        {items.map((item, i) => (
          <div key={i} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
      <div className={`whitespace-nowrap flex min-w-full shrink-0 items-center justify-around gap-8 ${directionClass} ${speedClass[speed]} absolute top-0 left-full`}>
        {items.map((item, i) => (
          <div key={`dup-${i}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
