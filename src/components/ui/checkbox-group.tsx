
import React, { createContext, useContext, useState } from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';

type CheckboxGroupContextValue = {
  value: string[];
  onValueChange: (value: string[]) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  onValueChange,
  className = '',
  children,
}) => {
  return (
    <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
    </CheckboxGroupContext.Provider>
  );
};

interface CheckboxItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({ value, children, disabled = false }) => {
  const context = useContext(CheckboxGroupContext);
  
  if (!context) {
    throw new Error('CheckboxItem must be used within a CheckboxGroup');
  }
  
  const { value: groupValue, onValueChange } = context;
  const checked = groupValue.includes(value);
  
  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      onValueChange([...groupValue, value]);
    } else {
      onValueChange(groupValue.filter(v => v !== value));
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={`checkbox-${value}`} 
        checked={checked} 
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
      />
      <Label 
        htmlFor={`checkbox-${value}`}
        className="cursor-pointer"
      >
        {children}
      </Label>
    </div>
  );
};
