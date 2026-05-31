import React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  active?: boolean;
  activeBorderColor?: string; // e.g. "border-blue-500" or "border-green-500"
};

export const PremiumCard = ({
  children,
  className,
  active = false,
  activeBorderColor = "border-blue-500",
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        "bg-white border rounded-[28px] p-6 shadow-[0_8px_24px_rgba(224,236,255,0.25)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(224,236,255,0.4)]",
        active ? `border-2 ${activeBorderColor} scale-[1.02]` : "border-slate-200/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
