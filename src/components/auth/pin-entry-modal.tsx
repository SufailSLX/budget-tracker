@@ .. @@
 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
+import { Input } from "@/components/ui/input";
+import { Label } from "@/components/ui/label";
 import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
 import { GlassCard } from "@/components/ui/glass-card";
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { useToast } from "@/hooks/use-toast";
 import { Key, HelpCircle } from "lucide-react";
-import { getUser } from "@/utils/storage";
+import { authAPI } from "@/utils/api";
+import { saveUser, clearUser } from "@/utils/storage";
 
 interface PinEntryModalProps {
   isOpen: boolean;
@@ .. @@
 
 export function PinEntryModal({ isOpen, onClose, onSuccess }: PinEntryModalProps) {
+  const [email, setEmail] = useState("");
   const [pin, setPin] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [showForgotPassword, setShowForgotPassword] = useState(false);
@@ .. @@
 
   const handleLogin = async () => {
-    if (pin.length !== 4) {
+    if (!email.trim() || pin.length !== 4) {
       toast({
-        title: "Invalid PIN",
-        description: "Please enter your 4-digit PIN.",
+        title: "Missing information",
+        description: "Please enter your email and 4-digit PIN.",
         variant: "destructive"
       });
       return;
@@ .. @@
     setIsLoading(true);
     
     try {
-      const user = getUser();
-      if (!user) {
-        toast({
-          title: "No account found",
-          description: "Please complete the setup first.",
-          variant: "destructive"
-        });
-        return;
-      }
-
-      if (user.pin !== pin) {
-        toast({
-          title: "Incorrect PIN",
-          description: "Please check your PIN and try again.",
-          variant: "destructive"
-        });
-        setPin("");
-        return;
+      const response = await authAPI.login(email, pin);
+      
+      if (response.success) {
+        // Save user data and token
+        const userData = {
+          id: response.user.id,
+          name: response.user.name,
+          email: response.user.email,
+          token: response.token,
+          createdAt: Date.now()
+        };
+        
+        saveUser(userData);
+        
+        toast({
+          title: "Welcome back!",
+          description: `Login successful. Welcome ${response.user.name}!`,
+        });
+        
+        onSuccess();
+        onClose();
+        setEmail("");
+        setPin("");
+      } else {
+        toast({
+          title: "Login failed",
+          description: response.message || "Please check your credentials.",
+          variant: "destructive"
+        });
+        setPin("");
       }
-
-      toast({
-        title: "Welcome back!",
-        description: `Login successful. Welcome ${user.name}!`,
-      });
-      
-      onSuccess();
-      onClose();
-      setPin("");
+    } catch (error) {
+      console.error('Login error:', error);
+      toast({
+        title: "Login failed",
+        description: "Unable to connect to server. Please try again.",
+        variant: "destructive"
+      });
+      setPin("");
     } finally {
       setIsLoading(false);
     }
@@ .. @@
 
   const handleForgotPassword = () => {
+    clearUser();
     toast({
       title: "PIN Reset",
-      description: "For security reasons, please clear app data and set up again.",
+      description: "Your data has been cleared. Please register again.",
     });
+    window.location.reload();
   };
 
@@ .. @@
               <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Key className="w-8 h-8 text-primary" />
                 </div>
                 <p className="text-muted-foreground text-sm">
-                  Enter your 4-digit PIN to access your account
+                  Enter your email and 4-digit PIN to access your account
                 </p>
               </div>
 
               <div className="space-y-4">
+                <div>
+                  <Label htmlFor="email">Email Address</Label>
+                  <Input
+                    id="email"
+                    type="email"
+                    placeholder="Enter your email"
+                    value={email}
+                    onChange={(e) => setEmail(e.target.value)}
+                    className="mt-1"
+                  />
+                </div>
+                
                 <div className="flex justify-center">
                   <InputOTP
                     maxLength={4}
@@ .. @@
                 <div className="space-y-3">
                   <Button 
                     onClick={handleLogin}
-                    disabled={isLoading || pin.length !== 4}
+                    disabled={isLoading || !email.trim() || pin.length !== 4}
                     className="w-full h-12"
                   >
                     {isLoading ? (
@@ .. @@
               <p className="text-muted-foreground text-sm">
                 For security reasons, we cannot recover your PIN. You'll need to clear your app data and set up a new account.
               </p>
               <div className="space-y-2">
                 <Button 
                   onClick={handleForgotPassword}
                   variant="destructive"
                   className="w-full"
                 >
-                  Clear Data & Setup New Account
+                  Clear Data & Register Again
                 </Button>
                 <Button 
                   variant="outline" 
@@ .. @@
   );
 }