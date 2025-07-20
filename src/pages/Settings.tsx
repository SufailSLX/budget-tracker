import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Moon, Sun, Heart, HelpCircle, Lock, Info, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast({
      title: newDarkMode ? "Dark mode enabled" : "Light mode enabled",
      description: "Your theme preference has been saved.",
    });
  };

  const handleRateUs = () => {
    toast({
      title: "Thank you! ⭐",
      description: "Your feedback means the world to us!",
    });
  };

  const handleFeedback = () => {
    toast({
      title: "Feedback sent! 💌",
      description: "We'll review your suggestions and get back to you.",
    });
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password reset initiated",
      description: "Check your email for reset instructions.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4 hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Dark Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {darkMode ? <Moon className="h-6 w-6 text-primary" /> : <Sun className="h-6 w-6 text-primary" />}
                  <div>
                    <h3 className="font-semibold">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Switch to a calming, eye-friendly look
                    </p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <Info className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">About Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Get to know the story behind the app — who we are and why we care
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Help & Support */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <HelpCircle className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Help & Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Stuck somewhere? Our support is just a tap away, ready to guide you
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Forgot Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard 
              className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer"
              onClick={handleForgotPassword}
            >
              <div className="flex items-center space-x-4">
                <Lock className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Forgot Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Recover access effortlessly with a gentle reset flow
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <Separator className="my-6" />

          {/* Rate Us & Feedback Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-center mb-4">
              ✨ We'd love your feedback!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rate Us */}
              <GlassCard 
                className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer group"
                onClick={handleRateUs}
              >
                <div className="text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold">Rate Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show us some love with a rating!
                  </p>
                </div>
              </GlassCard>

              {/* Feedback */}
              <GlassCard 
                className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer group"
                onClick={handleFeedback}
              >
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold">Send Feedback</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Help us improve your experience
                  </p>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-muted-foreground text-sm mt-8"
          >
            <Heart className="h-4 w-4 inline mr-2 text-primary" />
            Every interaction, every transition — smoother than your favorite playlist fade.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;