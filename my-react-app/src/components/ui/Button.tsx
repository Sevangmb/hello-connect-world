import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'text';
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none';
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    text: 'text-blue-500 hover:underline',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;