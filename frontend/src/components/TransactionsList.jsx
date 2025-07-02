import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

function TransactionList({ transactions = [], deleteTransaction, editTransaction }) {
  return (
    <Card className="main-container">
      <CardHeader>
        <h2 className="sub-heading-medium">Recent Transactions</h2>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "#666" }}>
            No transactions yet. Add your first transaction above.
          </div>
        ) : (
          transactions.map((item) => (
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
          ))
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
    <Card className={`transaction-card ${type === "expense" ? "expense" : "income"}`}>
      <CardContent className="p-6">
        {isEditing ? (
          <form onSubmit={handleEdit} className="main-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label>Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label>Description</label>
                <Input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label>Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
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

            <div className="flex justify-end gap-2 mt-4">
              <Button type="submit" variant="default">
                <Save className="sub-container-icon-medium" /> Save
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
                <X className="sub-container-icon-medium" /> Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-2 items-center">
                <span
                  className="sub-text"
                  style={{ color: type === "expense" ? "red" : "green", fontWeight: 700 }}
                >
                  {type === "expense" ? "Expense" : "Income"}
                </span>
                <h3 className="sub-text font-bold">{description || "No description"}</h3>
              </div>
              <div className="flex gap-4 items-center mt-1">
                <span
                  className="sub-heading-small"
                  style={{ color: type === "expense" ? "red" : "green" }}
                >
                  ₹{safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="sub-text-small text-gray-500">
                  {transactionDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" • "}
                  {transactionDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <span className="sub-text-small">{category}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit2 className="sub-container-icon-medium" />
              </Button>
              <Button
                onClick={() => deleteTransaction(item._id)} 
                variant="outline"
                className="hover:bg-red-50"
              >
                <Trash2 className="sub-container-icon-medium" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionList;