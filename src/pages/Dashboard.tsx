import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TradingChart } from "@/components/dashboard/trading-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { FinancialWellness } from "@/components/dashboard/financial-wellness";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/ui/footer";
import { getUser } from "@/utils/storage";
import { transactionsAPI } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalCredits: { value: 0, change: 0 }, totalDebits: { value: 0, change: 0 }, balance: { value: 0, change: 0 } });
  const [chartData, setChartData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"credit" | "debit">("debit");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    'Food & Dining',
    'Transportation', 
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Health & Fitness',
    'Travel',
    'Education',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      
      if (response.success) {
        setTransactions(response.transactions || []);
        calculateStats(response.transactions || []);
        generateChartData(response.transactions || []);
      } else {
        console.error('Failed to load transactions:', response.message);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error", 
        description: "Unable to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionList: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactionList.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    
    const totalCredits = currentMonthTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalDebits = currentMonthTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalCredits - totalDebits;
    
    // Calculate changes (mock for now)
    setStats({
      totalCredits: { value: totalCredits, change: 12 },
      totalDebits: { value: totalDebits, change: -5 },
      balance: { value: balance, change: 8 }
    });
  };

  const generateChartData = (transactionList: any[]) => {
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransactions = transactionList.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= monthStart && txDate <= monthEnd;
      });
      
      const credits = monthTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const debits = monthTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      last6Months.push({
        name: monthName,
        credits,
        debits,
        balance: credits - debits
      });
    }
    
    setChartData(last6Months);
  };

  const handleAddTransaction = () => {
    handleAddTransaction = async () => {
    if (!title || !amount) {
      toast({
        title: "Error",
        description: "Please fill in title and amount",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await transactionsAPI.create({
        title,
        amount: parseFloat(amount),
        type,
        category: category || "Other",
        date,
        description
      });
      
      if (response.success) {
        // Reload transactions to get updated data
        await loadTransactions();
        
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
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add transaction",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Unable to connect to server",
        variant: "destructive"
      });
    }
  };
  };

  const handleUpdateTransaction = (updatedTransaction: any) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
  };

  // Transform chart data to include balance calculation
  const chartDataWithBalance = chartData.map((item: any, index: number) => {
    const prevBalance = index > 0 ?
      chartData.slice(0, index).reduce((acc: number, curr: any) => acc + curr.credits - curr.debits, 0) : 0;
    return {
      ...item,
      balance: prevBalance + item.credits - item.debits
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
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
            onUpdateTransaction={handleUpdateTransaction}
          />
        </div>

        {/* Financial Wellness Dashboard */}
        <FinancialWellness
          totalCredits={stats.totalCredits.value}
          totalDebits={stats.totalDebits.value}
          balance={stats.balance.value}
        />

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