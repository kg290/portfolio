import { useRef } from 'react';
import './LogoLoop.css';

const LogoLoop = ({ items = [], direction = 'left', speed = 30 }) => {
  const scrollRef = useRef(null);
  const duration = Math.max(items.length * (100 / speed), 5);

  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="logo-loop" ref={scrollRef}>
      <div
        className={`logo-loop-track ${direction === 'right' ? 'scroll-right' : 'scroll-left'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, idx) => (
          <div key={idx} className="logo-loop-item">
            {typeof item === 'string' ? (
              <img src={item} alt={`logo-${idx}`} />
            ) : (
              item
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
