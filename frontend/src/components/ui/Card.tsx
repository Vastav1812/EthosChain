import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glowEffect?: boolean;
  hover3D?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  glowEffect = false,
  hover3D = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = (y - centerY) / 20;
    const rotateYValue = (centerX - x) / 20;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    if (!hover3D) return;
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden
        bg-[var(--gradient-card)]
        backdrop-blur-[var(--glass-blur)]
        border border-[var(--glass-border)]
        rounded-[var(--radius-lg)]
        ${glowEffect ? 'shadow-[var(--shadow-neon-primary)]' : 'shadow-[var(--shadow-lg)]'}
        transition-all duration-[var(--transition-normal)]
        ${className}
      `}
      style={{
        transform: hover3D ? `perspective(var(--perspective)) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : '',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={!hover3D ? { scale: 1.02 } : {}}
    >
      {/* Gradient overlay for glow effect */}
      {glowEffect && (
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[var(--color-primary-light)] to-transparent pointer-events-none" />
      )}
      
      {/* Card header */}
      {(title || subtitle) && (
        <div className={`p-6 border-b border-[var(--glass-border)] flex items-center gap-4 ${headerClassName}`}>
          {icon && (
            <div className="p-2 bg-[var(--glass-bg)] rounded-lg">
              {icon}
            </div>
          )}
          
          <div>
            {title && (
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
            )}
            
            {subtitle && (
              <p className="text-sm text-[var(--text-tertiary)]">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Card body */}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--glass-refraction)] to-transparent opacity-20 pointer-events-none" />
    </motion.div>
  );
};

export default Card; 