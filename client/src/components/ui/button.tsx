import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold" +
  " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] focus-visible:ring-offset-2" +
  " disabled:pointer-events-none disabled:opacity-50" +
  " [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " transition-all duration-150 ease-out hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0",
        gold:
          "bg-[#C8A96E] text-white border border-[#A68B55] shadow-[var(--shadow-gold,0_4px_20px_rgba(200,169,110,0.25))] hover:bg-[#A68B55] hover:shadow-[0_6px_28px_rgba(200,169,110,0.38)] hover:-translate-y-px active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border shadow-sm hover:shadow-md",
        outline:
          "border-[1.5px] border-current bg-transparent text-foreground hover:bg-foreground/5 shadow-sm",
        "outline-white":
          "border-[1.5px] border-white/40 bg-transparent text-white hover:bg-white/08 hover:border-white/70",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border shadow-sm hover:shadow-md",
        ghost:
          "border border-transparent bg-transparent hover:bg-foreground/5",
        link:
          "border border-transparent bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto shadow-none",
      },
      size: {
        default: "min-h-10 px-5 py-2.5",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-12 rounded-xl px-8 text-base",
        xl: "min-h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            {children}
          </>
        ) : children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
