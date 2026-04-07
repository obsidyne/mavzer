"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-red-200 min-h-screen --bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#111] border border-[#1f1f1f] rounded-xl p-10">

        <div className="mb-10">
          <h1 className="text-wxhite text-2xl font-bold tracking-[6px]">MAVZER</h1>
          <p className="text-[#444] text-[10px] tracking-[3px] mt-1 uppercase">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mavzer.com"
              required
              autoFocus
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white text-black font-semibold text-sm tracking-widest py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
}