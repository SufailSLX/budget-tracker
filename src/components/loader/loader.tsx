import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DollarSign, TrendingUp, PiggyBank } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

    // Animate the icons
    tl.fromTo(iconRef.current, 
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1.2, rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    )
    .to(iconRef.current, {
      rotation: 360,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: 1
    }, "-=0.5")
    .fromTo(textRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=1"
    )
    .to(loaderRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power3.in"
    }, "+=0.5");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 bg-background flex items-center justify-center z-50"
    >
      <div className="text-center">
        <div ref={iconRef} className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            <DollarSign className="w-24 h-24 text-primary absolute inset-0" />
            <TrendingUp className="w-8 h-8 text-accent absolute -top-2 -right-2 animate-pulse" />
            <PiggyBank className="w-6 h-6 text-muted-foreground absolute -bottom-1 -left-1" />
          </div>
        </div>
        
        <div ref={textRef} className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Expense Tracker</h2>
          <p className="text-muted-foreground">Loading your financial dashboard...</p>
        </div>
      </div>
    </div>
  );
}