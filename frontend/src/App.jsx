import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Transactions from "./routes/Transactions";
import { supabase } from "./lib/supabase";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const { isAuthenticated, authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const parseJsonSafely = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const getAuthHeaders = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return null;
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  };

  const handleUnauthorized = async () => {
    await supabase.auth.signOut();
    setTransactions([]);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }

    const loadTransactions = async () => {
      setTransactionsLoading(true);

      try {
        const headers = await getAuthHeaders();
        if (!headers) {
          await handleUnauthorized();
          return;
        }

        const res = await fetch(`${BASE_URL}/transactions`, {
          headers: {
            Authorization: headers.Authorization,
          },
        });
        const data = await parseJsonSafely(res);

        if (res.status === 401) {
          await handleUnauthorized();
          return;
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch transactions");
        }

        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setTransactionsLoading(false);
      }
    };

    loadTransactions();
  }, [isAuthenticated]);


  const addTransaction = async (tx) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        await handleUnauthorized();
        return;
      }

      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers,
        body: JSON.stringify(tx),
      });
      const newTx = await parseJsonSafely(res);

      if (res.status === 401) {
        await handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(newTx?.error || "Failed to add transaction");
      }
      setTransactions((prev) => [newTx, ...prev]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };


  const deleteTransaction = async (_id) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        await handleUnauthorized();
        return;
      }

      const res = await fetch(`${BASE_URL}/transactions/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: headers.Authorization,
        },
      });
      const responseBody = await parseJsonSafely(res);

      if (res.status === 401) {
        await handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(responseBody?.error || "Failed to delete transaction");
      }
      setTransactions((prev) => prev.filter((t) => t._id !== _id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };


  const editTransaction = async (_id, tx) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        await handleUnauthorized();
        return;
      }

      const res = await fetch(`${BASE_URL}/transactions/${_id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(tx),
      });
      const updatedTx = await parseJsonSafely(res);

      if (res.status === 401) {
        await handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(updatedTx?.error || "Failed to edit transaction");
      }
      setTransactions((prev) =>
        prev.map((t) => (t._id !== _id ? t : { ...t, ...(updatedTx || tx) }))
      );
    } catch (err) {
      console.error("Error editing transaction:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  const appShell = (
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
                transactionsLoading={transactionsLoading}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard transactions={transactions} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={<ProtectedRoute>{appShell}</ProtectedRoute>}
      />
    </Routes>
  );
}

export default App;
