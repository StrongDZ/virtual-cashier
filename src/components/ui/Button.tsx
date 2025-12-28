import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 touch-target relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-accent to-accent-dark text-slate-900 hover:from-accent-light hover:to-accent shadow-xl hover:shadow-2xl',
    secondary: 'glass text-white hover:bg-white/20 shadow-glass hover:shadow-glass-lg border-2 border-accent/30',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    outline: 'border-2 border-accent text-accent hover:bg-accent/10',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-6 text-xl',
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

export default Button;

