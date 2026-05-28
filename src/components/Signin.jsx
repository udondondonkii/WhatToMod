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
    <main className="flex min-h-[calc(100svh-120px)] items-center justify-center px-5 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-2xl shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
        <div className="bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 px-8 py-9 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Welcome back</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white">Sign in to WhatToMod</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">Log in to view your saved study plan
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5 px-8 py-8">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-950 dark:focus:ring-violet-500/20"
              type="email"
              placeholder="abc@xyz.com"
              id="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-950 dark:focus:ring-violet-500/20"
              type="password"
              placeholder="Enter your password"
              id="password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-white dark:text-slate-950 dark:shadow-black/30 dark:hover:bg-violet-200"
            id="submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Need an account?{" "}
            <Link to="/signup" className="font-semibold text-violet-600 transition hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200">
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Signin
