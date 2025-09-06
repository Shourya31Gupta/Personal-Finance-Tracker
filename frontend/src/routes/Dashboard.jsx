import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function Dashboard({ transactions }) {
  const [stats, setStats] = useState({
    total: 0,
    income: 0,
    expenses: 0,
    balance: 0,
    categories: {},
    recentTransactions: [],
    trend: { income: 0, expenses: 0 },
  });

  useEffect(() => {
    const calculateStats = () => {
      if (transactions.length === 0) {
        setStats((prev) => ({
          ...prev,
          total: 0,
          income: 0,
          expenses: 0,
          balance: 0,
          categories: {},
          recentTransactions: [],
          trend: { income: 0, expenses: 0 },
        }));

        return;
      }

      const total = transactions.length;

      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = income - expenses;

      
      const categories = transactions.reduce((acc, t) => {
        const category = t.category.toLowerCase();
        if (!acc[category]) acc[category] = 0;
        acc[category] += Number(t.amount);
        return acc;
      }, {});

      // Get recent transactions
      const recentTransactions = transactions
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

      // Calculate month-over-month trend
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

      const thisMonthTransactions = transactions.filter(
        (t) => new Date(t.id).getMonth() === currentMonth
      );
      const lastMonthTransactions = transactions.filter(
        (t) => new Date(t.id).getMonth() === lastMonth
      );

      const trend = {
        income:
          (thisMonthTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0) /
            (lastMonthTransactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + Number(t.amount), 0) || 1) -
            1) *
          100,
        expenses:
          (thisMonthTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0) /
            (lastMonthTransactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + Number(t.amount), 0) || 1) -
            1) *
          100,
      };

      setStats({
        total,
        income,
        expenses,
        balance,
        categories,
        recentTransactions,
        trend,
      });
    };

    calculateStats();
  }, [transactions]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Financial Overview</h1>
        <p className="text-slate-600">Track your financial health and spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Total Balance</span>
              <div className="p-2 bg-slate-200 rounded-lg">
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₹{stats.balance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From {stats.total} transactions
            </p>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-700">Income</span>
              <div className="p-2 bg-emerald-200 rounded-lg">
                {stats.trend.income > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ₹{stats.income.toLocaleString()}
            </div>
            <p className={`text-xs mt-1 ${
              stats.trend.income > 0 ? "text-emerald-600" : "text-red-500"
            }`}>
              {stats.trend.income > 0 ? "+" : ""}{stats.trend.income.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-700">Expenses</span>
              <div className="p-2 bg-red-200 rounded-lg">
                {stats.trend.expenses > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{stats.expenses.toLocaleString()}
            </div>
            <p className={`text-xs mt-1 ${
              stats.trend.expenses > 0 ? "text-red-500" : "text-emerald-500"
            }`}>
              {stats.trend.expenses > 0 ? "+" : ""}{stats.trend.expenses.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Top Category Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Top Category</span>
              <div className="p-2 bg-blue-200 rounded-lg">
                <PieChart className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 capitalize">
              {Object.entries(stats.categories).sort(
                ([, a], [, b]) => b - a
              )[0]?.[0] || "None"}
            </div>
            <p className="text-xs text-blue-600 mt-1">Highest spending category</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "expense" 
                          ? "bg-red-100" 
                          : "bg-emerald-100"
                      }`}>
                        {transaction.type === "expense" ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(transaction.id).toLocaleDateString()} at{" "}
                          {new Date(transaction.id).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === "expense" ? "text-red-600" : "text-emerald-600"
                      }`}>
                        {transaction.type === "expense" ? "-" : "+"}₹
                        {Number(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Spending Categories */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Spending by Category</h2>
              <PieChart className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            {Object.entries(stats.categories).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PieChart className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">No spending data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(stats.categories)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount], index) => {
                    const percentage = stats.expenses > 0 ? (amount / stats.expenses) * 100 : 0;
                    const colors = [
                      "bg-blue-500",
                      "bg-purple-500", 
                      "bg-emerald-500",
                      "bg-orange-500",
                      "bg-pink-500"
                    ];
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${colors[index] || "bg-slate-500"}`}></div>
                            <span className="font-medium text-slate-900 capitalize">
                              {category}
                            </span>
                          </div>
                          <span className="font-semibold text-slate-900">
                            ₹{amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${colors[index] || "bg-slate-500"} transition-all duration-500`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500">
                          {percentage.toFixed(1)}% of total expenses
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
export default Dashboard;