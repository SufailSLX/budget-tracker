import { GlassCard } from "@/components/ui/glass-card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: "credit" | "debit" | "balance";
  index: number;
}

export function StatsCard({ title, value, change, icon, index }: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (valueRef.current) {
      gsap.fromTo(
        valueRef.current,
        { textContent: 0 },
        {
          textContent: value,
          duration: 2,
          delay: index * 0.2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function() {
            if (valueRef.current) {
              valueRef.current.textContent = Math.floor(this.targets()[0].textContent).toString();
            }
          }
        }
      );
    }
  }, [value, index]);

  const getIcon = () => {
    switch (icon) {
      case "credit":
        return <TrendingUp className="h-6 w-6 text-success" />;
      case "debit":
        return <TrendingDown className="h-6 w-6 text-destructive" />;
      case "balance":
        return <DollarSign className="h-6 w-6 text-neon" />;
    }
  };

  const isPositive = change >= 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
    >
      <GlassCard hover className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <span ref={valueRef} className="text-2xl font-bold text-foreground">
                0
              </span>
              <span
                className={cn(
                  "text-sm font-medium flex items-center",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? "+" : ""}{change}%
              </span>
            </div>
          </div>
          <div className="animate-float">
            {getIcon()}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ');
}