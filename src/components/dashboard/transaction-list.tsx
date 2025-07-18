import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "expense";
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

export function TransactionList({ transactions, onAddTransaction }: TransactionListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <Button onClick={onAddTransaction} size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              className="flex items-center justify-between p-4 border border-glass-border rounded-lg backdrop-blur-sm hover:border-neon/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === "credit" 
                    ? "bg-success/20 text-success" 
                    : "bg-destructive/20 text-destructive"
                }`}>
                  {transaction.type === "credit" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{transaction.date}</span>
                  </div>
                </div>
              </div>
              <div className={`text-lg font-semibold ${
                transaction.type === "credit" ? "text-success" : "text-destructive"
              }`}>
                {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}