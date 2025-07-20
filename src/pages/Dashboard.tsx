import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AnimatedChart } from "@/components/dashboard/animated-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTransactions, saveTransaction, getMonthlyData, getStats, getCategories, getUser, saveUser } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [transactions, setTransactions] = useState(getTransactions());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const [isUserSetup, setIsUserSetup] = useState(false);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"credit" | "expense">("expense");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!user) {
      setIsUserSetup(true);
    }
  }, [user]);

  const stats = getStats();
  const chartData = getMonthlyData();
  const categories = getCategories();

  const handleAddTransaction = () => {
    if (!title || !amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newTransaction = saveTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0]
    });

    setTransactions([newTransaction, ...transactions]);
    setTitle("");
    setAmount("");
    setCategory("");
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: `${type === "credit" ? "Credit" : "Expense"} added successfully!`,
    });
  };

  const handleUserSetup = (userData: { name: string; email: string; pin: string }) => {
    const newUser = saveUser({ name: userData.name, email: userData.email, pin: userData.pin });
    setUser(newUser);
    setIsUserSetup(false);
    
    toast({
      title: "Welcome!",
      description: `Welcome to Credit Tracker, ${userData.name}!`,
    });
  };

  if (isUserSetup) {
    return <OnboardingFlow onComplete={handleUserSetup} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user?.name || "User"} />

      <main className="p-6 space-y-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatsCard
            title="Total Credits"
            value={stats.totalCredits.value}
            change={stats.totalCredits.change}
            icon="credit"
            index={0}
          />
          <StatsCard
            title="Total Expenses"
            value={stats.totalExpenses.value}
            change={stats.totalExpenses.change}
            icon="expense"
            index={1}
          />
          <StatsCard
            title="Balance"
            value={stats.balance.value}
            change={stats.balance.change}
            icon="balance"
            index={2}
          />
        </motion.div>

        {/* Chart and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatedChart data={chartData} title="6-Month Overview" />
          <TransactionList
            transactions={transactions.slice(0, 8)}
            onAddTransaction={() => setIsDialogOpen(true)}
          />
        </div>

        {/* Add Transaction Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Transaction title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <Label>Type</Label>
                <RadioGroup value={type} onValueChange={(value: "credit" | "expense") => setType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit">Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Expense</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleAddTransaction} className="flex-1">
                  Add Transaction
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}