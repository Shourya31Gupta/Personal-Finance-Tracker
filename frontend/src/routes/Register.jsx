import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import bgImage from "@/assets/bg.jpg";
import logoImage from "@/assets/logo.png";

function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message || "Unable to register.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);

    // If email confirmation is disabled, user is already authenticated.
    if (data.session) {
      navigate("/", { replace: true });
      return;
    }

    navigate("/login", {
      replace: true,
      state: { from: "/" },
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 py-10 relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay with blur for the background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* App Title */}
        <div className="mb-8 flex flex-col items-center">
          <img src={logoImage} alt="Logo" className="w-32 h-32 object-contain mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md text-center">
            Personal Finance Tracker
          </h1>
        </div>

        {/* Glassmorphism Card */}
        <Card className="w-full bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="space-y-2 pb-6">
            <h2 className="text-2xl font-bold text-center text-white drop-shadow-sm">Create account</h2>
            <p className="text-center text-slate-200 text-sm">
              Start tracking your finances securely
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-slate-200 focus-visible:ring-white/50"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-slate-200 focus-visible:ring-white/50"
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-slate-200 focus-visible:ring-white/50"
              />
              {error ? (
                <p className="text-sm text-red-200 bg-red-900/50 border border-red-500/30 px-3 py-2 rounded-md backdrop-blur-sm">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg" disabled={submitting}>
                {submitting ? "Creating account..." : "Register"}
              </Button>
            </form>
            <p className="text-sm text-center text-slate-200 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-300 hover:text-white font-semibold transition-colors">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register;
