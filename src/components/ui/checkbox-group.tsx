
import React, { createContext, useContext } from 'react';
import { Checkbox } from './checkbox';
import { cn } from '@/lib/utils';

const CheckboxGroupContext = createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
}>({
  value: [],
  onValueChange: () => {},
});

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export const CheckboxGroup = ({
  value,
  onValueChange,
  className,
  children,
}: CheckboxGroupProps) => {
  return (
    <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </CheckboxGroupContext.Provider>
  );
};

interface CheckboxItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const CheckboxItem = ({
  value,
  children,
  className,
}: CheckboxItemProps) => {
  const { value: groupValue, onValueChange } = useContext(CheckboxGroupContext);
  
  const isChecked = groupValue.includes(value);

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      onValueChange([...groupValue, value]);
    } else {
      onValueChange(groupValue.filter(v => v !== value));
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Checkbox 
        id={`checkbox-${value}`} 
        checked={isChecked} 
        onCheckedChange={handleCheckedChange} 
      />
      <label
        htmlFor={`checkbox-${value}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  );
};
