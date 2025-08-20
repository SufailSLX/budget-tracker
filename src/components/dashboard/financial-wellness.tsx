import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Shield, PiggyBank, CreditCard, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialWellnessProps {
  totalCredits: number;
  totalDebits: number;
  balance: number;
}

export function FinancialWellness({ totalCredits, totalDebits, balance }: FinancialWellnessProps) {
  // Calculate wellness metrics
  const savingsRate = totalCredits > 0 ? ((balance / totalCredits) * 100) : 0;
  const spendingRatio = totalCredits > 0 ? ((totalDebits / totalCredits) * 100) : 0;
  const creditScore = Math.min(850, Math.max(300, 650 + (savingsRate * 2))); // Mock credit score
  const budgetUtilization = Math.min(100, spendingRatio);
  
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-500";
    if (score >= 600) return "text-yellow-500";
    return "text-red-500";
  };

  const getWellnessScore = () => {
    let score = 0;
    if (savingsRate > 20) score += 25;
    else if (savingsRate > 10) score += 15;
    else if (savingsRate > 0) score += 10;
    
    if (spendingRatio < 80) score += 25;
    else if (spendingRatio < 90) score += 15;
    else if (spendingRatio < 100) score += 10;
    
    if (creditScore >= 700) score += 25;
    else if (creditScore >= 600) score += 15;
    else score += 5;
    
    if (balance > 0) score += 25;
    else score += 5;
    
    return Math.min(100, score);
  };

  const wellnessScore = getWellnessScore();
  
  const getWellnessLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-500", bg: "bg-green-500/10" };
    if (score >= 60) return { level: "Good", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (score >= 40) return { level: "Fair", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { level: "Needs Improvement", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const wellness = getWellnessLevel(wellnessScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Financial Wellness Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overall Wellness Score */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Wellness Score
              </h3>
              <Badge className={cn("text-xs", wellness.bg, wellness.color)}>
                {wellness.level}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Health</span>
                <span className="font-medium">{wellnessScore}/100</span>
              </div>
              <Progress value={wellnessScore} className="h-2" />
            </div>
          </div>
        </GlassCard>

        {/* Credit Score Monitor */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Credit Score
              </h3>
              <Badge variant="outline" className="text-xs">
                Estimated
              </Badge>
            </div>
            <div className="space-y-2">
              <div className={cn("text-2xl font-bold", getScoreColor(creditScore))}>
                {Math.round(creditScore)}
              </div>
              <Progress value={(creditScore - 300) / (850 - 300) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on your financial behavior
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Savings Tracking */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                Savings Rate
              </h3>
              <Badge variant={savingsRate > 20 ? "default" : savingsRate > 10 ? "secondary" : "destructive"} className="text-xs">
                {savingsRate > 20 ? "Great" : savingsRate > 10 ? "Good" : "Low"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Savings vs Income</span>
                <span className="font-medium">{savingsRate.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(100, savingsRate * 3)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Recommended: 20%+ of income
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Budget Utilization */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Budget Health
              </h3>
              <Badge variant={budgetUtilization < 80 ? "default" : budgetUtilization < 90 ? "secondary" : "destructive"} className="text-xs">
                {budgetUtilization < 80 ? "Healthy" : budgetUtilization < 90 ? "Caution" : "Over Budget"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spending Ratio</span>
                <span className="font-medium">{budgetUtilization.toFixed(1)}%</span>
              </div>
              <Progress value={budgetUtilization} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Keep spending under 80% of income
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Investment Overview */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <h3 className="font-semibold">Investment Readiness</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">Emergency Fund</div>
              <div className={cn("text-lg font-bold", balance > totalDebits * 3 ? "text-green-500" : "text-yellow-500")}>
                {balance > totalDebits * 3 ? "✓ Ready" : "Building"}
              </div>
              <div className="text-xs text-muted-foreground">3+ months expenses</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">Investment Capital</div>
              <div className={cn("text-lg font-bold", balance > 0 && savingsRate > 10 ? "text-green-500" : "text-yellow-500")}>
                ${Math.max(0, balance * 0.3).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Available to invest</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">Risk Tolerance</div>
              <div className={cn("text-lg font-bold", creditScore > 650 ? "text-green-500" : "text-yellow-500")}>
                {creditScore > 700 ? "High" : creditScore > 650 ? "Medium" : "Low"}
              </div>
              <div className="text-xs text-muted-foreground">Based on stability</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}