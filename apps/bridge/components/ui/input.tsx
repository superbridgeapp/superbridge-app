import * as React from "react";

import { cn } from "@/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// className="bg-muted block w-full rounded-lg border-0 py-3 px-4 pr-10 text-sm font-medium  outline-none focus:ring-2 ring-inset ring-zinc-900/5 dark:ring-zinc-50/5 placeholder:text-muted-foreground sm:leading-6"
// "flex h-10 w-full rounded-md border border-border border-2 bg-muted px-3 py-2 text-sm ring-inset-0 file:border-0 file:bg-transparent text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-inset-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "text-sm font-medium flex h-10 w-full rounded-lg bg-muted px-4 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
