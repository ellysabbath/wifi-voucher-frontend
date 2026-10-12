import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authApi } from "../../lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = (location.state as { email?: string; code?: string }) ?? {};

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !code) navigate("/forgot-password", { replace: true });
  }, [email, code, navigate]);

  const getStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strength = getStrength(form.password);
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const colors = ["bg-red-500", "bg-red-400", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-green-600"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({
        email: email!,
        code: code!,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      navigate("/password-reset-success");
    } catch (err: any) {
      setError(err?.message ?? "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set New Password" subtitle="Choose a strong password for your account">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <KeyRound size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
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

          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < strength ? colors[strength] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Strength: <span className="font-semibold">{labels[strength]}</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
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
          <KeyRound size={18} /> {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}