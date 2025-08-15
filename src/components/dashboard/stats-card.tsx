import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, CreditCard, Wallet, Scale } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: "credit" | "debit" | "balance";
  index: number;
}

export function StatsCard({ title, value, change, icon, index }: StatsCardProps) {
  const isPositive = change >= 0;
  
  const iconMap = {
    credit: CreditCard,
    debit: Wallet,
    balance: Scale,
  };
  
  const IconComponent = iconMap[icon];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-colors duration-300",
              icon === "credit" && "bg-green-100 text-green-600 group-hover:bg-green-200",
              icon === "debit" && "bg-red-100 text-red-600 group-hover:bg-red-200",
              icon === "balance" && "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
            )}>
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</h3>
          </div>
          <Badge 
            variant={isPositive ? "default" : "destructive"}
            className="flex items-center space-x-1 text-xs"
          >
            {isPositive ? (
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </Badge>
        </div>
        
        <div className="space-y-1">
          <motion.p 
            className="text-xl sm:text-2xl font-bold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          >
            ${value.toLocaleString()}
          </motion.p>
          <p className="text-xs text-muted-foreground">
            {isPositive ? "↗" : "↘"} {Math.abs(change)}% from last month
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}