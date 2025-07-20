import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover = false, glow = false, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-glass-border backdrop-blur-sm rounded-lg shadow-card",
        "transition-all duration-500 ease-smooth",
        hover && "hover:shadow-glow hover:border-neon/30 hover:-translate-y-1",
        glow && "animate-glow-pulse",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}