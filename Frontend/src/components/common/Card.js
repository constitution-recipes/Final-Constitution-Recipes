import { cn } from "@/lib/utils";

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-card transition-all hover:shadow-card-hover",
        "bg-gradient-card animate-fadeIn",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-gradient",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("flex items-center pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card }; 