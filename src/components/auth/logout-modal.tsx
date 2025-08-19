import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Key, HelpCircle, LogOut } from "lucide-react";
import { getUser } from "@/utils/storage";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
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
          description: "Unable to verify PIN.",
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
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      onConfirm();
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
    // Clear user data and reload
    localStorage.removeItem('credit_tracker_user');
    localStorage.removeItem('hasSeenOnboarding');
    window.location.reload();
  };

  const handleCancel = () => {
    setPin("");
    setShowForgotPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-center">
            🔐 Confirm Logout
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {!showForgotPassword ? (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-destructive" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Enter your 4-digit PIN to confirm logout
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
                    onClick={handleLogout}
                    disabled={isLoading || pin.length !== 4}
                    variant="destructive"
                    className="w-full h-12"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Logging out...</span>
                      </div>
                    ) : (
                      "Confirm Logout"
                    )}
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="w-full"
                  >
                    Cancel
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
                  Back to Logout
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}