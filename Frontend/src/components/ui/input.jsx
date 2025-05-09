import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, variant = "default", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg px-4 py-2 text-sm transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        variant === "search" ? "rounded-full bg-muted border-none shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2" :
        variant === "pill" ? "rounded-full bg-background border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" :
        "bg-background border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input } 