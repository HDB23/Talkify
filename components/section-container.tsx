import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SectionContainer = ({ children, className }: Props) => {
  return (
    <div className={cn("w-full py-2", className)}>
      {children}
    </div>
  );
};
