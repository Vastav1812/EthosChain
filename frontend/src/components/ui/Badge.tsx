import React from 'react';
import { motion } from 'framer-motion';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  glow?: boolean;
  pulse?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  glow = false,
  pulse = false,
  className = '',
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--color-primary)] text-white';
      case 'secondary':
        return 'bg-[var(--color-secondary)] text-white';
      case 'accent':
        return 'bg-[var(--color-accent)] text-white';
      case 'success':
        return 'bg-[var(--color-success)] text-white';
      case 'warning':
        return 'bg-[var(--color-warning)] text-gray-900';
      case 'error':
        return 'bg-[var(--color-error)] text-white';
      case 'info':
        return 'bg-[var(--color-info)] text-white';
      default:
        return 'bg-[var(--color-primary)] text-white';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1';
      default:
        return 'text-sm px-2.5 py-0.5';
    }
  };

  const getGlowEffectClass = (): string => {
    if (!glow) return '';
    
    switch (variant) {
      case 'primary':
        return 'shadow-[var(--shadow-neon-primary)]';
      case 'accent':
        return 'shadow-[var(--shadow-neon-accent)]';
      case 'success':
        return 'shadow-[0_0_10px_rgba(6,214,160,0.5)]';
      case 'warning':
        return 'shadow-[0_0_10px_rgba(255,209,102,0.5)]';
      case 'error':
        return 'shadow-[0_0_10px_rgba(239,71,111,0.5)]';
      case 'info':
        return 'shadow-[0_0_10px_rgba(17,138,178,0.5)]';
      default:
        return 'shadow-[var(--shadow-neon-primary)]';
    }
  };

  return (
    <motion.span
      className={`
        inline-flex items-center justify-center rounded-full
        font-medium whitespace-nowrap
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getGlowEffectClass()}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {icon && <span className="mr-1 flex-shrink-0">{icon}</span>}
      {children}
    </motion.span>
  );
};

export default Badge; 