import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 1.5, 
  className = "", 
  prefix = "$" 
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const previousValue = useRef(0);

  useEffect(() => {
    if (!counterRef.current) return;

    const counter = { value: previousValue.current };
    
    gsap.to(counter, {
      value: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `${prefix}${Math.round(counter.value).toLocaleString()}`;
        }
      }
    });

    previousValue.current = value;
  }, [value, duration, prefix]);

  return <span ref={counterRef} className={className}>{prefix}{value.toLocaleString()}</span>;
}