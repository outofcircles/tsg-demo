
import React from 'react';

// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', as: Tag = 'button', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-primary-500',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Tag className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
    <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`} {...props}>{children}</div>
);

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => (
    <div className={`p-4 sm:p-6 ${className}`} {...props}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({children, className}) => (
    <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>
)

// Input Component
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Textarea Component
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Select Component
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => {
    return (
      <select
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
});


// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
export const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

// StatCard Component
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}
export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <Card>
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
};
