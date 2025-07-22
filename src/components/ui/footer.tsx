import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(footerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} className="mt-16 py-8 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by{' '}
          <span className="text-primary font-medium hover:text-primary/80 transition-colors cursor-pointer">
            @SLX.dev
          </span>
        </p>
      </div>
    </footer>
  );
}