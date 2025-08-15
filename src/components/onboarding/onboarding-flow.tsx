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
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      title: "Enter your details",
      description: "We'll use this to send you a secure one-time password (OTP).",
      icon: <Mail className="w-6 h-6" />
    },
    {
      title: "Check your email",
      description: "It'll arrive shortly—just a quick peek in your inbox!",
      icon: <Mail className="w-6 h-6" />
    },
    {
      title: "Enter the OTP",
      description: "This keeps your account extra safe and sound.",
      icon: <Shield className="w-6 h-6" />
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
        if (!name.trim() || !email.trim()) {
          toast({
            title: "Missing information",
            description: "Please enter both your name and email.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Simulate registration success (no backend required)
        toast({
          title: "OTP Sent!",
          description: "Check your email for the verification code.",
        });
        setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        if (otp.length !== 6) {
          toast({
            title: "Invalid OTP",
            description: "Please enter the 6-digit code from your email.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Simulate OTP verification (accept any 6-digit code)
        toast({
          title: "Email verified!",
          description: "Now let's set up your PIN.",
        });
        setStep(4);
      } else if (step === 4) {
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
        const userData = { name, email, pin };
        localStorage.setItem('credit_tracker_user', JSON.stringify(userData));
        
        setStep(5);
        // Complete setup after a brief delay
        setTimeout(() => {
          onComplete({ name, email, pin });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Credit Tracker
            </h1>
            
            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {Array.from({ length: 5 }, (_, i) => (
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
            
            <h2 className="text-xl font-semibold mb-2">{currentStep.title}</h2>
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
                <>
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
                  <div>
                    <Label htmlFor="email">✉️ Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    We've sent a verification code to <br />
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Label htmlFor="otp" className="block text-center">🔐 Enter 6-digit OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              )}

              {step === 4 && (
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

              {step === 5 && (
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

          {step < 5 && (
            <Button 
              onClick={handleNext}
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{step === 2 ? "I've checked" : step === 4 ? "Set PIN" : "Continue"}</span>
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