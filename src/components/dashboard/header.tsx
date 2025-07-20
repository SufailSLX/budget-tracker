import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
    )
    .fromTo(greetingRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between p-6 border-b border-glass-border"
    >
      <div>
        <h1 ref={titleRef} className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Credit Tracker
        </h1>
        <p ref={greetingRef} className="text-muted-foreground mt-1">
          {getGreeting()}, {userName}! Track your financial future.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
}