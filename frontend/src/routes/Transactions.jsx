import React from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionsList from '@/components/TransactionsList';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

function Transactions({
  transactions,
  addTransaction,
  deleteTransaction,
  editTransaction,
}) {
  const balance = transactions.reduce((acc, item) => {
    return item.type === "expense"
    ? acc - Number(item.amount)
    : acc + Number(item.amount);
  }, 0);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, item) => acc + Number(item.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Transactions</h1>
        <p className="text-slate-600">Manage your income and expenses</p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Current Balance</p>
                <p className={`text-3xl font-bold ${
                  balance >= 0 ? "text-emerald-600" : "text-red-600"
                }`}>
                  ₹{balance.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {balance >= 0 ? "Positive balance" : "Negative balance"}
                </p>
              </div>
              <div className="p-3 bg-slate-200 rounded-full">
                <Wallet className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Income</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{income.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {transactions.filter(t => t.type === "income").length} transactions
                </p>
              </div>
              <div className="p-3 bg-emerald-200 rounded-full">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">
                  ₹{expenses.toLocaleString()}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {transactions.filter(t => t.type === "expense").length} transactions
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Form and List */}
      <div className="grid gap-8 lg:grid-cols-2">
        <TransactionForm addTransaction={addTransaction} />
        <TransactionsList 
          transactions={transactions}  
          deleteTransaction={deleteTransaction}
          editTransaction={editTransaction} 
        />
      </div>
    </div>
  );
}

export default Transactions;