import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, DollarSign, FileText, Tag, PlusCircle } from "lucide-react";

function TransactionForm({ addTransaction }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income"); 
  const [category, setCategory] = useState("General"); 
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const storedCategories =
      JSON.parse(localStorage.getItem("customCategories")) || [];
    setCustomCategories(storedCategories);
  }, []);

 
  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(customCategories));
  }, [customCategories]);

  const handleAdd = (e) => {
    e.preventDefault();

    if (amount && description) {
      addTransaction({
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        type,
        category,
      });
      setAmount(0);
      setDescription("");
      setType("income");
      setCategory("General"); 
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();

    if (newCategory.trim()) {
      setCustomCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Add New Transaction</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Amount</span>
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              className="w-full h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Description</span>
            </label>
            <Input
              id="description"
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="w-full h-11"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-slate-700">
                Transaction Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
                {customCategories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Add Custom Category</label>
            <div className="flex gap-2">
              <Input
                id="newCategory"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter custom category..."
                className="flex-1 h-11"
              />
              <Button 
                type="button"
                onClick={handleAddCategory} 
                disabled={!newCategory.trim()}
                variant="outline"
                className="h-11 px-4"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={!amount || !description}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default TransactionForm;