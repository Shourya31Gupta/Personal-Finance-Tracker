import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Trash2, X, List, Calendar, Tag, DollarSign } from "lucide-react";
import { useState } from "react";

function TransactionList({ transactions = [], deleteTransaction, editTransaction }) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-slate-100 rounded-lg">
            <List className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">All Transactions</h2>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">No transactions yet</p>
            <p className="text-slate-400 text-sm">Add your first transaction using the form</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((item) => (
              <TransactionItem
                key={item._id}
                item={{
                  _id: item._id, 
                  amount: item.amount || 0,
                  description: item.description || "",
                  type: item.type || "expense",
                  category: item.category || "General",
                }}
                deleteTransaction={deleteTransaction}
                editTransaction={editTransaction}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionItem({ item, deleteTransaction, editTransaction }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(item.amount);
  const [description, setDescription] = useState(item.description);
  const [type, setType] = useState(item.type);
  const [category, setCategory] = useState(item.category);

  const handleEdit = (e) => {
    e.preventDefault();
    editTransaction(item._id, {
      amount: parseFloat(amount) || 0,
      description,
      type,
      category,
    });
    setIsEditing(false);
  };

  const transactionDate = item._id ? new Date(parseInt(item._id.toString().substring(0, 8), 16) * 1000) : new Date();
  const safeAmount = parseFloat(amount) || 0;

  return (
    <Card className={`${
      type === "expense" 
        ? "border-l-4 border-l-red-500 bg-red-50/30" 
        : "border-l-4 border-l-emerald-500 bg-emerald-50/30"
    } hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  type === "expense" ? "bg-red-100" : "bg-emerald-100"
                }`}>
                  {type === "expense" ? (
                    <DollarSign className="w-4 h-4 text-red-600" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{description || "No description"}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {transactionDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span className="capitalize">{category}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  type === "expense" ? "text-red-600" : "text-emerald-600"
                }`}>
                  {type === "expense" ? "-" : "+"}₹{safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500">
                  {transactionDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => deleteTransaction(item._id)} 
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;