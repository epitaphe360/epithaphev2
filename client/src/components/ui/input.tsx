import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-[1.5px] border-black/[0.14] bg-white px-4 py-3 text-[0.9375rem] text-foreground",
          "ring-offset-background",
          "placeholder:text-black/35",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:border-[#C8A96E] focus-visible:ring-[3px] focus-visible:ring-[#C8A96E]/16",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
