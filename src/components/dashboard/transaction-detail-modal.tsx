import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { X, Edit3 } from "lucide-react";
import { getCategories, getTransactions, saveTransaction } from "@/utils/storage";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  date: string;
  description?: string;
}

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onUpdate: (updatedTransaction: Transaction) => void;
}

export function TransactionDetailModal({ 
  isOpen, 
  onClose, 
  transaction, 
  onUpdate 
}: TransactionDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const categories = getCategories();

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
      setIsEditing(false);
    }
  }, [transaction]);

  const handleSave = () => {
    if (!formData) return;

    if (!formData.title || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in title and amount",
        variant: "destructive"
      });
      return;
    }

    // Update transaction in storage
    const transactions = getTransactions();
    const updatedTransactions = transactions.map(t => 
      t.id === formData.id ? formData : t
    );
    localStorage.setItem('credit_tracker_transactions', JSON.stringify(updatedTransactions));

    onUpdate(formData);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Transaction updated successfully!",
    });
  };

  const handleCancel = () => {
    if (transaction) {
      setFormData({ ...transaction });
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (!transaction || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            Transaction Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Transaction Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              rows={3}
            />
          </div>

          <div>
            <Label>Type</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={(value: "credit" | "debit") => 
                setFormData({ ...formData, type: value })
              }
              disabled={!isEditing}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="credit" disabled={!isEditing} />
                <Label htmlFor="credit">💰 Credit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="debit" id="debit" disabled={!isEditing} />
                <Label htmlFor="debit">💸 Debit</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={!isEditing}
            >
              <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                <SelectValue />
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
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="flex-1 h-12 sm:h-10"
              >
                Edit Transaction
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSave} 
                  className="flex-1 h-12 sm:h-10"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  className="h-12 sm:h-10"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}