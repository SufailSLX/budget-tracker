import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TradingChart } from "@/components/dashboard/trading-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { LoginModal } from "@/components/auth/login-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/ui/footer";
import { getTransactions, saveTransaction, getMonthlyData, getStats, getCategories, getUser, saveUser } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [transactions, setTransactions] = useState(getTransactions());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"credit" | "debit">("debit");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!user) {
      setIsUserSetup(true);
    } else if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [user, isLoggedIn]);

  const stats = getStats();
  const chartData = getMonthlyData();
  const categories = getCategories();

  const handleAddTransaction = () => {
    if (!title || !amount) {
      toast({
        title: "Error",
        description: "Please fill in title and amount",
        variant: "destructive"
      });
      return;
    }

    const newTransaction = saveTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category: category || "Other",
      date,
      description
    });

    setTransactions([newTransaction, ...transactions]);
    setTitle("");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: `${type === "credit" ? "Credit" : "Debit"} added successfully!`,
    });
  };

  const handleUserSetup = (userData: { name: string; email: string; pin: string }) => {
    const newUser = saveUser({ name: userData.name, email: userData.email, pin: userData.pin });
    setUser(newUser);
    setIsUserSetup(false);
    setIsLoggedIn(true);
    
    toast({
      title: "Welcome!",
      description: `Welcome to Credit Tracker, ${userData.name}!`,
    });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // Transform chart data to include balance calculation
  const chartDataWithBalance = chartData.map((item, index) => {
    const prevBalance = index > 0 ? 
      chartData.slice(0, index).reduce((acc, curr) => acc + curr.credits - curr.debits, 0) : 0;
    return {
      ...item,
      balance: prevBalance + item.credits - item.debits
    };
  });

  if (isUserSetup) {
    return <OnboardingFlow onComplete={handleUserSetup} />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Credit Tracker</h1>
            <p className="text-muted-foreground">Please login to continue</p>
          </div>
        </div>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user?.name || "User"} />

      <main className="p-3 sm:p-6 space-y-6 sm:space-y-8 pb-20">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        >
          <StatsCard
            title="Total Credits"
            value={stats.totalCredits.value}
            change={stats.totalCredits.change}
            icon="credit"
            index={0}
          />
          <StatsCard
            title="Total Debits"
            value={stats.totalDebits.value}
            change={stats.totalDebits.change}
            icon="debit"
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <TradingChart data={chartDataWithBalance} title="Balance Trends - 6 Month Overview" />
          <TransactionList
            transactions={transactions.slice(0, 8)}
            onAddTransaction={() => setIsDialogOpen(true)}
          />
        </div>

        {/* Add Transaction Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>💰 Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Transaction Title *</Label>
                <Input
                  id="title"
                  placeholder="Transaction title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Type</Label>
                <RadioGroup value={type} onValueChange={(value: "credit" | "debit") => setType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit">💰 Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit">💸 Debit</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category (optional)" />
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

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button onClick={handleAddTransaction} className="flex-1 hover:shadow-glow transition-all duration-300 h-12 sm:h-10">
                  Add Transaction
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-accent transition-all duration-300 h-12 sm:h-10">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
}