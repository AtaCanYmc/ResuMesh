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

  const directionClass = direction === 'left' ? 'motion-safe:animate-marquee' : 'motion-safe:animate-marquee-reverse';

  return (
    <div className={`flex overflow-hidden touch-pan-y motion-reduce:overflow-x-auto ${className}`}>
      {/* Group 1 */}
      <div className={`flex min-w-full shrink-0 items-center justify-around gap-8 px-4 ${directionClass} ${speedClass[speed]} will-change-transform`}>
        {items.map((item, i) => (
          <div key={`group1-${i}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
      {/* Group 2 (Duplicate for seamless loop) */}
      <div className={`hidden motion-safe:flex min-w-full shrink-0 items-center justify-around gap-8 px-4 ${directionClass} ${speedClass[speed]} will-change-transform`} aria-hidden="true">
        {items.map((item, i) => (
          <div key={`group2-${i}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
