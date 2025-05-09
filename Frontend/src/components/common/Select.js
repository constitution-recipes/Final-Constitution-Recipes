import React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-200",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

const Option = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <option
      ref={ref}
      className={cn(
        "text-sm text-foreground",
        "disabled:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </option>
  );
});
Option.displayName = "Option";

const FormSelect = ({ label, error, className, children, ...props }) => {
  const id = React.useId();

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-foreground"
        >
          {label}
        </label>
      )}
      <Select id={id} error={error} className={className} {...props}>
        {children}
      </Select>
      {error && (
        <p className="text-sm text-destructive animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};

export { Select, Option, FormSelect }; 