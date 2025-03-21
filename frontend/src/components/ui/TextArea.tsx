import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helpText,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <motion.label 
          htmlFor={props.id}
          className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        <textarea
          className={`
            w-full px-4 py-2
            bg-[var(--glass-bg)] border ${isFocused ? 'border-[var(--color-primary)]' : error ? 'border-[var(--color-error)]' : 'border-[var(--glass-border)]'} 
            rounded-lg 
            focus:outline-none focus:ring-2 ${error ? 'focus:ring-[var(--color-error)]' : 'focus:ring-[var(--color-primary)]'} 
            text-[var(--text-primary)] 
            placeholder:text-[var(--text-tertiary)]
            transition-all duration-[var(--transition-normal)]
            ${isFocused ? 'shadow-[var(--shadow-neon-primary)]' : ''}
            backdrop-blur-[var(--glass-blur)]
            resize-none
            ${className || ''}
          `}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        
        {error && (
          <motion.div 
            className="absolute top-2 right-0 pr-3 flex items-start pointer-events-none"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <svg className="h-5 w-5 text-[var(--color-error)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>
      
      {(error || helpText) && (
        <motion.div 
          className={`mt-1 text-sm ${error ? 'text-[var(--color-error)]' : 'text-[var(--text-tertiary)]'}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {error || helpText}
        </motion.div>
      )}
    </div>
  );
};

export default TextArea; 