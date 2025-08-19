import { GlassCard } from "@/components/ui/glass-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ChartData {
  name: string;
  credits: number;
  debits: number;
  balance: number;
}

interface TradingChartProps {
  data: ChartData[];
  title: string;
}

export function TradingChart({ data, title }: TradingChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween>();

  // Transform data to include cumulative balance
  const transformedData = data.map((item, index) => {
    const prevBalance = index > 0 ? data[index - 1].credits - data[index - 1].debits : 0;
    const currentBalance = item.credits - item.debits;
    return {
      ...item,
      balance: prevBalance + currentBalance,
      netFlow: currentBalance
    };
  });

  useEffect(() => {
    if (chartRef.current) {
      // Initial entrance animation
      gsap.fromTo(
        chartRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          delay: 0.3,
          ease: "power3.out"
        }
      );
      
      // Subtle floating animation
      animationRef.current = gsap.to(chartRef.current, {
        y: -3,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Animate chart lines
      const paths = chartRef.current.querySelectorAll('.recharts-area path');
      paths.forEach((path, index) => {
        gsap.fromTo(path, 
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          { 
            strokeDashoffset: 0, 
            duration: 2, 
            delay: 0.5 + index * 0.3,
            ease: "power2.out"
          }
        );
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <GlassCard className="p-4 border border-primary/20">
          <p className="text-sm font-bold text-primary mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-400">
              Credits: ${data.credits?.toLocaleString()}
            </p>
            <p className="text-sm text-red-400">
              Debits: ${data.debits?.toLocaleString()}
            </p>
            <p className="text-sm font-semibold text-foreground">
              Balance: ${data.balance?.toLocaleString()}
            </p>
            <p className={`text-sm font-medium ${data.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Net: {data.netFlow >= 0 ? '+' : ''}${data.netFlow?.toLocaleString()}
            </p>
          </div>
        </GlassCard>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <GlassCard className="p-6 bg-gradient-to-br from-background to-background/50 backdrop-blur-xl border border-primary/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500/60 animate-pulse" />
            <span className="text-xs text-muted-foreground">LIVE</span>
          </div>
        </div>
        
        <div ref={chartRef} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="creditsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="1 3" 
                stroke="hsl(var(--border))"
                opacity={0.2}
                vertical={false}
              />
              
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 11,
                  fontWeight: 500
                }}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 11,
                  fontWeight: 500
                }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine 
                y={0} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="2 2" 
                opacity={0.5}
              />
              
              {/* Background area for credits */}
              <Area
                type="monotone"
                dataKey="credits"
                stackId="1"
                stroke="#22c55e"
                strokeWidth={0}
                fill="url(#creditsGradient)"
                fillOpacity={0.1}
              />
              
              {/* Main balance line with trading-style appearance */}
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#balanceGradient)"
                fillOpacity={0.4}
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))',
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: 'hsl(var(--primary))', 
                  strokeWidth: 3,
                  fill: 'hsl(var(--background))',
                  filter: 'drop-shadow(0 0 8px hsl(var(--primary)))'
                }}
                className="trading-line"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Trading-style indicators */}
        <div className="mt-4 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Credits</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Balance</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}