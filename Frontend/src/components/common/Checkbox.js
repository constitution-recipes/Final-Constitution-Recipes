import React from 'react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded border border-input bg-background",
        "text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

const FormCheckbox = ({ label, error, className, ...props }) => {
  const id = React.useId();

  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={id} className={className} {...props} />
      <div className="space-y-1 leading-none">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        {error && (
          <p className="text-sm text-destructive animate-slide-up">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export { Checkbox, FormCheckbox }; 