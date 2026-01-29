
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25',
    secondary: 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 rounded-xl font-bold',
    lg: 'px-8 py-4 rounded-2xl text-lg',
    icon: 'p-3 rounded-full',
  };

  return (
    <button
      className={cn(
          'transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
