import { GlassCard } from "@/components/ui/glass-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ChartData {
  name: string;
  credits: number;
  debits: number;
}

interface AnimatedChartProps {
  data: ChartData[];
  title: string;
}

export function AnimatedChart({ data, title }: AnimatedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween>();

  useEffect(() => {
    if (chartRef.current) {
      gsap.fromTo(
        chartRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.5,
          ease: "back.out(1.7)"
        }
      );
      
      // Non-stop continuous floating animation
      animationRef.current = gsap.to(chartRef.current, {
        y: -5,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
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
      return (
        <GlassCard className="p-3">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value}
            </p>
          ))}
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
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-6 text-foreground">{title}</h3>
        <div ref={chartRef} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="credits"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                className="animate-chart-draw"
              />
              <Line
                type="monotone"
                dataKey="debits"
                stroke="hsl(var(--destructive))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
                className="animate-chart-draw"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}