import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Mail, Shield, Key, Sparkles } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (userData: { name: string; email: string; pin: string }) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      title: "Enter your details",
      description: "Let's get you set up with your account details.",
      icon: <Mail className="w-6 h-6" />
    },
    {
      title: "Set a 4-digit PIN",
      description: "Make it easy for you to remember, but hard for others to guess!",
      icon: <Key className="w-6 h-6" />
    },
    {
      title: "All done!",
      description: "You're now ready to explore your dashboard. Let's make great things happen!",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      if (step === 1) {
        if (!name.trim()) {
          toast({
            title: "Missing information",
            description: "Please enter your name.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        setStep(2);
      } else if (step === 2) {
        if (pin.length !== 4 || confirmPin.length !== 4) {
          toast({
            title: "Invalid PIN",
            description: "Please enter a 4-digit PIN.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        if (pin !== confirmPin) {
          toast({
            title: "PINs don't match",
            description: "Please make sure both PINs are the same.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Save user data to localStorage
        const userData = { name, email: `${name.toLowerCase().replace(/\s+/g, '')}@credittracker.com`, pin };
        localStorage.setItem('credit_tracker_user', JSON.stringify(userData));
        
        setStep(3);
        // Complete setup after a brief delay
        setTimeout(() => {
          onComplete({ name, email: userData.email, pin });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Credit Tracker
            </h1>
            
            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i + 1 <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                {currentStep.icon}
              </div>
            </div>
            
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{currentStep.title}</h2>
            <p className="text-muted-foreground text-sm">{currentStep.description}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {step === 1 && (
                <div>
                  <Label htmlFor="name">📝 Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label htmlFor="pin">🔢 Set 4-digit PIN</Label>
                    <div className="flex justify-center mt-2">
                      <InputOTP
                        maxLength={4}
                        value={pin}
                        onChange={setPin}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPin">🔄 Confirm PIN</Label>
                    <div className="flex justify-center mt-2">
                      <InputOTP
                        maxLength={4}
                        value={confirmPin}
                        onChange={setConfirmPin}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-lg font-medium text-green-500 mb-2">🎉 Setup Complete!</p>
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 3 && (
            <Button 
              onClick={handleNext}
              disabled={isLoading}
              className="w-full mt-6 h-12 text-base"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{step === 2 ? "Set PIN" : "Continue"}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}