import { Button } from "@/components/ui/button";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('credit_tracker_user');
    localStorage.removeItem('hasSeenOnboarding');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Reload the page to trigger the onboarding flow
    window.location.reload();
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-accent"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}