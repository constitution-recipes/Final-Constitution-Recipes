import React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-200",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const FormTextarea = ({ label, error, className, ...props }) => {
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
      <Textarea id={id} error={error} className={className} {...props} />
      {error && (
        <p className="text-sm text-destructive animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};

export { Textarea, FormTextarea }; 