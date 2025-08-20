import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownLeft, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { TransactionDetailModal } from "./transaction-detail-modal";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onUpdateTransaction: (updatedTransaction: Transaction) => void;
}

export function TransactionList({ transactions, onAddTransaction, onUpdateTransaction }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <GlassCard className="p-4 sm:p-6">
        <div className="space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Transactions</h3>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <Button onClick={onAddTransaction} size="sm" className="bg-primary hover:bg-primary/90 h-9 px-3 text-sm">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
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
              className="flex items-center justify-between p-3 sm:p-4 border border-glass-border rounded-lg backdrop-blur-sm hover:border-neon/30 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedTransaction(transaction);
                setIsDetailModalOpen(true);
              }}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div className={`p-1.5 sm:p-2 rounded-full shrink-0 ${
                  transaction.type === "credit" 
                    ? "bg-success/20 text-success" 
                    : "bg-destructive/20 text-destructive"
                }`}>
                  {transaction.type === "credit" ? (
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <ArrowDownLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{transaction.title}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
                    <Badge variant="secondary" className="text-xs w-fit">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{transaction.date}</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm sm:text-lg font-semibold shrink-0 ml-2 ${
                transaction.type === "credit" ? "text-success" : "text-destructive"
              }`}>
                {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
              </div>
            </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">
                {searchTerm ? "🔍" : "💳"}
              </div>
              <p className="text-lg font-medium mb-2">
                {searchTerm ? "No matching transactions" : "No transactions yet"}
              </p>
              <p className="text-sm">
                {searchTerm ? "Try adjusting your search terms" : "Add your first transaction to get started!"}
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onUpdate={(updatedTransaction) => {
          onUpdateTransaction(updatedTransaction);
          setIsDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </motion.div>
  );
}