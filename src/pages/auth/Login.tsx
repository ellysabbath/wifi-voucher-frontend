// src/pages/auth/Login.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authApi, tokenStore } from "../../lib/auth";
import { isStaffRole, isAdminPath } from "../../lib/roles";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If the user was bounced here by a route guard, remember where
  // they were headed so we can send them back after login.
  const fromPath = (location.state as { from?: { pathname?: string } })?.from
    ?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({
        email: form.email,
        password: form.password,
      });

      // Not verified → go to verify page
      if (res.needs_verification) {
        navigate("/verify-account", {
          state: { email: res.email ?? form.email },
        });
        return;
      }

      if (res.access && res.refresh) {
        tokenStore.set({ access: res.access, refresh: res.refresh });

        // ---- Role-based redirect ----
        const profile = await authApi.me();
        const staff = isStaffRole(profile.role);

        // 1. Default landing page per role
        const defaultDest = staff ? "/dashboard" : "/user/dashboard";

        // 2. If they were bounced by a guard, honor that if allowed
        let dest = defaultDest;
        if (fromPath) {
          dest = isAdminPath(fromPath) && !staff
            ? "/user/dashboard"
            : fromPath;
        }

        navigate(dest, { replace: true });
      }
    } catch (err: any) {
      const msg = err?.message ?? "Login failed";
      if (msg.toLowerCase().includes("not verified")) {
        navigate("/verify-account", { state: { email: form.email } });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-primary font-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn size={18} /> {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}