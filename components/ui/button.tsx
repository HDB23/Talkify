import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive uppercase tracking-wide",
  {
    variants: {
      variant: {
        locked: "bg-neutral-200 text-neutral-400 hover:bg-neutral-200/90 border-neutral-300 border-b-4 active:border-b-0",
        default: "bg-white text-slate-600 border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-50",
        primary : "bg-gradient-to-b from-[#1a85ff] to-[#0059e3] text-white border-[#0047b3] border-b-4 active:border-b-0 active:translate-y-[2px] hover:brightness-105 shadow-[0_4px_12px_rgba(0,89,227,0.15)]",
        primaryOutline: "bg-white text-[#0059e3] border-2 border-[#0059e3]/20 hover:bg-[#eef6ff] border-b-4 border-b-[#0059e3]/30 active:border-b-2",
        secondary: "bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white border-[#15803d] border-b-4 active:border-b-0 active:translate-y-[2px] hover:brightness-105 shadow-[0_4px_12px_rgba(22,163,74,0.15)]",
        secondaryOutline: "bg-white text-[#16a34a] border-2 border-[#16a34a]/20 hover:bg-green-50/50 border-b-4 border-b-[#16a34a]/30 active:border-b-2",
        danger: "bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white border-[#b91c1c] border-b-4 active:border-b-0 active:translate-y-[2px] hover:brightness-105",
        dangerOutline: "bg-white text-[#ef4444] border-2 border-[#ef4444]/20 hover:bg-rose-50/50 border-b-4 border-b-[#ef4444]/30 active:border-b-2",
        super: "bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] text-white border-[#6d28d9] border-b-4 active:border-b-0 active:translate-y-[2px] hover:brightness-105 shadow-[0_4px_12px_rgba(124,58,237,0.15)]",
        superOutline: "bg-white text-[#7c3aed] border-2 border-[#7c3aed]/20 hover:bg-indigo-50/50 border-b-4 border-b-[#7c3aed]/30 active:border-b-2",
        ghost: "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100/80 hover:text-slate-700",
        sidebar: "bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100/50 transition-all rounded-2xl",
        sidebarOutline : "bg-[#eaf3ff] text-[#0059e3] border-[#0059e3]/10 border-2 hover:bg-[#eaf3ff]/80 transition-all rounded-2xl"
      },
      size: {
        default: "h-11 px-4 py-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        // "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        // "icon-sm": "size-8",
        // "icon-lg": "size-10",
        rounded : "rounded-full"
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
