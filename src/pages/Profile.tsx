import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Calendar, Link2, DollarSign, Bell, Camera, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUser } from "@/utils/storage";
import { Footer } from "@/components/ui/footer";
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [showSavingsSuggestions, setShowSavingsSuggestions] = useState(false);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  const handleBudgetSubmit = () => {
    if (monthlyBudget) {
      setShowSavingsSuggestions(true);
    }
  };
  const getSavingsSuggestions = () => {
    const budget = parseFloat(monthlyBudget);
    if (!budget) return [];
    return [{
      title: "Emergency Fund",
      amount: Math.round(budget * 0.2),
      description: "Save 20% for unexpected expenses"
    }, {
      title: "Investment Portfolio",
      amount: Math.round(budget * 0.15),
      description: "Invest 15% for long-term growth"
    }, {
      title: "Entertainment",
      amount: Math.round(budget * 0.1),
      description: "Allocate 10% for leisure activities"
    }];
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-glow-pulse"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-neon/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed"></div>

      <motion.div className="relative z-10 container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="flex items-center mb-8" variants={itemVariants}>
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-4 hover:bg-glass-border/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Your Profile
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Details Section */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 hover glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="mr-3 h-5 w-5 text-neon" />
                Your Details
              </h2>
              
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-2 border-neon/30">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-glass-surface text-lg font-semibold">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-glass-surface border-neon/30 hover:bg-neon/20">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user?.name || "Not set"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{user?.email || "Not set"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Link Account Section */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 hover glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Link2 className="mr-3 h-5 w-5 text-neon" />
                Link Account
              </h2>
              
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-glass-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-neon" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Connect your other accounts for a unified experience
                </p>
                <Button className="bg-gradient-primary hover:shadow-glow">
                  Connect Account
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Savings Plan Section */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 hover glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <DollarSign className="mr-3 h-5 w-5 text-neon" />
                Savings Plan
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input id="budget" type="number" placeholder="Enter your monthly budget" value={monthlyBudget} onChange={e => setMonthlyBudget(e.target.value)} className="bg-glass-surface border-glass-border" />
                    <Button onClick={handleBudgetSubmit} className="bg-gradient-primary">
                      Calculate
                    </Button>
                  </div>
                </div>

                {showSavingsSuggestions && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: "auto"
              }} className="space-y-3 mt-6">
                    <h3 className="font-medium text-neon">Tailored Suggestions</h3>
                    {getSavingsSuggestions().map((suggestion, index) => <motion.div key={suggestion.title} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: index * 0.1
                }} className="bg-glass-surface p-3 rounded-lg border border-glass-border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{suggestion.title}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          </div>
                          <p className="text-lg font-bold text-neon">${suggestion.amount}</p>
                        </div>
                      </motion.div>)}
                  </motion.div>}
              </div>
            </GlassCard>
          </motion.div>

          {/* Notifications Section */}
          
        </div>

        <Footer />
      </motion.div>
    </div>;
};
export default Profile;