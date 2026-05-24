import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin-auth", "true");
        localStorage.setItem("auth-token", data.data.token);
        navigate("/admin");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🍔</span>
          <h1 className="text-2xl font-extrabold text-yellow-400 mt-3">QuickBite</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel Login</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-bold text-xl mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quickbite.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-gray-900 font-bold py-3 rounded-xl transition mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

          </form>

          {/* Hint */}
          <div className="mt-6 bg-gray-800 rounded-xl px-4 py-3">
            <p className="text-gray-500 text-xs font-semibold mb-1">Demo Credentials</p>
            <p className="text-gray-400 text-xs">📧 admin@quickbite.com</p>
            <p className="text-gray-400 text-xs">🔑 admin123</p>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center text-gray-600 text-sm mt-6">
          <a href="/" className="hover:text-yellow-400 transition">← Back to website</a>
        </p>

      </div>
    </div>
  );
}
