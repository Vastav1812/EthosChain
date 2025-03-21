import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'glass' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  glowEffect?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  glowEffect = false,
  className,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-light)] text-white';
      case 'accent':
        return 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] text-white';
      case 'glass':
        return 'bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)] text-[var(--text-primary)]';
      case 'outline':
        return 'bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)]';
      default:
        return 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const getGlowEffect = (): string => {
    if (!glowEffect) return '';

    switch (variant) {
      case 'primary':
        return 'shadow-[var(--shadow-neon-primary)]';
      case 'accent':
        return 'shadow-[var(--shadow-neon-accent)]';
      default:
        return 'shadow-[var(--shadow-neon-primary)]';
    }
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-[var(--radius-md)] font-medium 
        transition-all duration-[var(--transition-normal)]
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${fullWidth ? 'w-full' : ''} 
        ${getGlowEffect()}
        ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
        ${className || ''}
      `}
      whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>

      {/* Sheen effect */}
      <span 
        className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[var(--glass-shine)] to-transparent 
        opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out`}
      />
    </motion.button>
  );
};

export default Button; 