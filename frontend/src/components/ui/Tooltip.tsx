import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  width?: string;
  glow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  delay = 300,
  position = 'top',
  className = '',
  width = '200px',
  glow = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionStyles = (): string => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowPosition = (): string => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 transform translate-x-[-50%] translate-y-[100%] border-t-[var(--color-primary)] border-l-transparent border-r-transparent border-b-transparent';
      case 'right':
        return 'left-0 top-1/2 transform translate-x-[-100%] translate-y-[-50%] border-r-[var(--color-primary)] border-t-transparent border-b-transparent border-l-transparent';
      case 'bottom':
        return 'top-0 left-1/2 transform translate-x-[-50%] translate-y-[-100%] border-b-[var(--color-primary)] border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-0 top-1/2 transform translate-x-[100%] translate-y-[-50%] border-l-[var(--color-primary)] border-t-transparent border-b-transparent border-r-transparent';
      default:
        return 'bottom-0 left-1/2 transform translate-x-[-50%] translate-y-[100%] border-t-[var(--color-primary)] border-l-transparent border-r-transparent border-b-transparent';
    }
  };

  const initialAnimation = {
    opacity: 0,
    ...(position === 'top' && { y: 10 }),
    ...(position === 'right' && { x: -10 }),
    ...(position === 'bottom' && { y: -10 }),
    ...(position === 'left' && { x: 10 }),
  };

  const animateAnimation = {
    opacity: 1,
    y: 0,
    x: 0,
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${getPositionStyles()} ${className}`}
            style={{ width }}
            initial={initialAnimation}
            animate={animateAnimation}
            exit={initialAnimation}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div 
              className={`
                relative 
                bg-gradient-to-br from-[var(--glass-bg)] to-[rgba(30,30,45,0.9)]
                backdrop-blur-[var(--glass-blur)]
                border border-[var(--glass-border)]
                rounded-[var(--radius-md)]
                p-3
                text-sm
                ${glow ? 'shadow-[var(--shadow-neon-primary)]' : ''}
              `}
            >
              {content}
              <div className={`absolute w-0 h-0 border-solid border-4 ${getArrowPosition()}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip; 