import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn(email, password);
      if (result.success) { 
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6EDDC] flex flex-col items-center justify-center px-4 font-sans antialiased">
      <div className="w-full max-w-md">
        
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-[#E95420] tracking-tight font-['League_Spartan']">
            What<span className="text-[#2564F8]">To</span>Mod
            </h1>
          <p className="text-s font-bold tracking-widest text-gray-600 mt-2">
            Your one-stop NUS Module Planner
          </p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Email address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="e0123456@u.nus.edu"
                id="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-base text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D63ED]/20 focus:border-[#1D63ED] transition duration-150"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                id="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-base text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D63ED]/20 focus:border-[#1D63ED] transition duration-150"
              />
            </div>

            
            {error && (
              <div className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 transition animate-fade-in">
                {error}
              </div>
            )}

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E95420] hover:bg-[#d44513] text-white text-base font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        
        <p className="text-sm text-gray-600 mt-6 text-center font-semibold">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#1D63ED] font-bold hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Signin;