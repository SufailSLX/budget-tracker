import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AnimatedChart } from "@/components/dashboard/animated-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
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

  const handleUserSetup = (name: string, email: string) => {
    const newUser = saveUser({ name, email });
    setUser(newUser);
    setIsUserSetup(false);
    
    toast({
      title: "Welcome!",
      description: `Welcome to Credit Tracker, ${name}!`,
    });
  };

  if (isUserSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-glass-border rounded-lg p-8 shadow-card">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Credit Tracker
              </h1>
              <p className="text-muted-foreground">Set up your profile to get started</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUserSetup(
                formData.get('name') as string,
                formData.get('email') as string
              );
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Get Started
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
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