import { useRef, useEffect } from 'react';
import './Lanyard.css';

const Lanyard = ({ name = '', title = '', avatarUrl = '', handle = '' }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let animFrame;
    let rotation = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let swaying = true;

    const handleMouseMove = (e) => {
      swaying = false;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      target.x = ((e.clientY - cy) / rect.height) * 20;
      target.y = ((e.clientX - cx) / rect.width) * 20;
    };

    const handleMouseLeave = () => {
      swaying = true;
    };

    const animate = () => {
      if (swaying) {
        const t = Date.now() * 0.001;
        target.x = Math.sin(t * 0.8) * 5;
        target.y = Math.cos(t * 0.6) * 8;
      }
      rotation.x += (target.x - rotation.x) * 0.08;
      rotation.y += (target.y - rotation.y) * 0.08;
      card.style.transform = `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
      animFrame = requestAnimationFrame(animate);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div className="lanyard-wrapper">
      <div className="lanyard-string">
        <svg viewBox="0 0 100 120" className="lanyard-svg">
          <path
            d="M50 0 Q48 40 50 60 Q52 80 50 120"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      <div className="lanyard-card" ref={cardRef}>
        <div className="lanyard-card-inner">
          <div className="lanyard-hole" />
          {avatarUrl && (
            <img src={avatarUrl} alt={name} className="lanyard-avatar" />
          )}
          <div className="lanyard-info">
            <h4 className="lanyard-name">{name}</h4>
            {handle && <p className="lanyard-handle">{handle}</p>}
            {title && <p className="lanyard-title">{title}</p>}
          </div>
          <div className="lanyard-barcode">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="lanyard-bar"
                style={{ width: Math.random() > 0.5 ? '3px' : '1.5px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lanyard;
