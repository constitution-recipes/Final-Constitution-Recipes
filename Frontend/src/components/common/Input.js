import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 레이블 컴포넌트
 */
const Label = ({ className, ...props }) => (
  <label
    className={cn(
      "text-sm font-medium leading-none text-foreground",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);
Label.displayName = "Label";

/**
 * 입력 필드 컴포넌트
 */
const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
};

/**
 * 입력 필드 그룹 컴포넌트
 * 레이블, 입력 필드, 에러 메시지를 포함하는 컴포넌트
 */
const FormInput = ({ label, error, className, ...props }) => {
  const id = React.useId();
  
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input 
        id={id}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};
FormInput.displayName = "FormInput";

export { Input, Label, FormInput }; 