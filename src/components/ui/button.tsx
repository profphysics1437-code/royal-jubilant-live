import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary: Navy bg + white text → Gold bg + navy text on hover
        default:
          "bg-[#0A1F44] text-white shadow-sm hover:bg-[#C9A961] hover:text-[#0A1F44] hover:shadow-md",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Outline: White bg + Navy border + Navy text → Navy bg + white text on hover
        outline:
          "border border-[#0A1F44] bg-white text-[#0A1F44] shadow-xs hover:bg-[#0A1F44] hover:text-white",
        // Secondary: Silver bg + Navy text
        secondary:
          "bg-[#F4F5F7] text-[#0A1F44] border border-[#E5E7EB] shadow-xs hover:bg-[#E5E7EB] hover:border-[#9CA3AF]",
        ghost:
          "hover:bg-[#F4F5F7] hover:text-[#0A1F44] dark:hover:bg-accent/50",
        link: "text-[#0A1F44] underline-offset-4 hover:underline hover:text-[#A68A3F]",
        // Gold variant for premium CTAs
        gold:
          "bg-[#C9A961] text-[#0A1F44] shadow-sm hover:bg-[#D4B875] hover:shadow-md font-medium",
        // Navy outline (silver border)
        "navy-outline":
          "border border-[#E5E7EB] bg-white text-[#0A1F44] shadow-xs hover:border-[#A68A3F] hover:text-[#A68A3F]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4 text-sm",
        xl: "h-12 rounded-full px-8 has-[>svg]:px-6 text-sm",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
