import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  TrendingUp,
  Wallet,
  DollarSign,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home({ transactions }) {
  const stats = transactions.reduce(
    (acc, item) => {
      const amount = Number(item.amount);
      if (item.type === "expense") {
        acc.expenses += amount;
      } else {
        acc.income += amount;
      }
      acc.total = acc.income - acc.expenses;
      return acc;
    },
    { total: 0, income: 0, expenses: 0 }
  );

  const recentTransactions = transactions
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome to Your Finance Tracker
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Take control of your finances with our intuitive and powerful tracking tools. 
          Monitor your income, expenses, and financial health all in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Balance</p>
                <p className={`text-3xl font-bold ${
                  stats.total >= 0 ? "text-emerald-600" : "text-red-600"
                }`}>
                  ₹{stats.total.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {stats.total >= 0 ? "Positive balance" : "Negative balance"}
                </p>
              </div>
              <div className="p-3 bg-emerald-200 rounded-full">
                <Wallet className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Income</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{stats.income.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  From {transactions.filter(t => t.type === "income").length} transactions
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-700" />
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
                  ₹{stats.expenses.toLocaleString()}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  From {transactions.filter(t => t.type === "expense").length} transactions
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
              <p className="text-slate-600">Add a new transaction or view your dashboard</p>
            </div>
            <div className="flex gap-3">
              <Link to="/transactions">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">No transactions yet</p>
              <p className="text-slate-400 text-sm">Start by adding your first transaction!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "expense" 
                        ? "bg-red-100" 
                        : "bg-emerald-100"
                    }`}>
                      {transaction.type === "expense" ? (
                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(transaction.id).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
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
        {recentTransactions.length > 0 && (
          <CardFooter className="pt-4">
            <Link to="/transactions" className="w-full">
              <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50">
                View All Transactions
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default Home;