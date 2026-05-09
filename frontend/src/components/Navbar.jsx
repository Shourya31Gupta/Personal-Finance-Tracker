import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/transactions", label: "Transactions", icon: CreditCard },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <h1 className="text-xl font-bold text-slate-800">FinanceTracker</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ul className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
              <span className="max-w-[180px] truncate">{user?.email || "Unknown user"}</span>
            </div>
            <Button type="button" variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;