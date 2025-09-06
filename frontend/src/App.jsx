import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import Transactions from "./routes/Transactions";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/transactions`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);


  const addTransaction = async (tx) => {
    try {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });
      const newTx = await res.json();
      setTransactions((prev) => [newTx, ...prev]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };


  const deleteTransaction = async (_id) => {
    try {
      await fetch(`${BASE_URL}/transactions/${_id}`, {
        method: "DELETE",
      });
      setTransactions((prev) => prev.filter((t) => t._id !== _id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };


  const editTransaction = async (_id, tx) => {
    try {
      await fetch(`${BASE_URL}/transactions/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });
      setTransactions((prev) =>
        prev.map((t) => (t._id !== _id ? t : { ...t, ...tx }))
      );
    } catch (err) {
      console.error("Error editing transaction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home transactions={transactions} />} />
          <Route
            path="/transactions"
            element={
              <Transactions
                transactions={transactions}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
                editTransaction={editTransaction}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard transactions={transactions} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
