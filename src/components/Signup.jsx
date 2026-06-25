import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const { session, signUp } = UserAuth();
    const navigate = useNavigate();
    console.log(session);

    const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const result = await signUp(email, password);

        if (result.error) {
        setError(result.error);
        return;
        }

        if (result.success) {
        navigate("/dashboard");
        }
    } catch (error) {
        setError(error.message || "An error occurred");
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
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            <div className="bg-[#1D63ED] px-8 py-5">
            <h2 className="text-2xl font-bold text-white">Create account</h2>
            <p className="text-sm text-white/75 mt-1">
                Don't know what to mod? We can help!
            </p>
            </div>

            <div className="p-8">
            <form onSubmit={handleSignUp} className="space-y-5">

                <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Email address
                </label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="e0123456@u.nus.edu"
                    id="email"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-base text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D63ED]/20 focus:border-[#1D63ED] transition duration-150"
                />
                </div>

                <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Password
                </label>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    id="password"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-base text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D63ED]/20 focus:border-[#1D63ED] transition duration-150"
                />
                </div>

                {error && (
                <div className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                </div>
                )}

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1D63ED] hover:bg-[#1650c4] text-white text-base font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                {loading ? "Creating account..." : "Sign Up"}
                </button>

            </form>
            </div>
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center font-semibold">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#E95420] font-bold hover:underline ml-1">
            Sign in
            </Link>
        </p>

        </div>
    </main>
    );
}

export default Signup;