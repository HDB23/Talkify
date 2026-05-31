import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const PageWrapper = ({ children, className }: Props) => {
  return (
    <div className={cn("w-full h-full pb-10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2", className)}>
      {children}
    </div>
  );
};
