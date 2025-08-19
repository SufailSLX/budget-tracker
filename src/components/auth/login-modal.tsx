import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GlassCard } from "@/components/ui/glass-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Key, HelpCircle } from "lucide-react";
import { getUser } from "@/utils/storage";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit PIN.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const user = getUser();
      if (!user) {
        toast({
          title: "No account found",
          description: "Please complete the setup first.",
          variant: "destructive"
        });
        return;
      }

      if (user.pin !== pin) {
        toast({
          title: "Incorrect PIN",
          description: "Please check your PIN and try again.",
          variant: "destructive"
        });
        setPin("");
        return;
      }

      toast({
        title: "Welcome back!",
        description: `Login successful. Welcome ${user.name}!`,
      });
      
      onSuccess();
      onClose();
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "PIN Reset",
      description: "For security reasons, please clear app data and set up again.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-center">
            🔐 Enter Your PIN
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {!showForgotPassword ? (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Enter your 4-digit PIN to access your account
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
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

                <div className="space-y-3">
                  <Button 
                    onClick={handleLogin}
                    disabled={isLoading || pin.length !== 4}
                    className="w-full h-12"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <Button 
                    variant="ghost" 
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Forgot PIN?
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold">PIN Recovery</h3>
              <p className="text-muted-foreground text-sm">
                For security reasons, we cannot recover your PIN. You'll need to clear your app data and set up a new account.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleForgotPassword}
                  variant="destructive"
                  className="w-full"
                >
                  Clear Data & Setup New Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}