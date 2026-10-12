import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authApi } from "../../lib/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Enter your email.");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      navigate("/forgot-password-code", { state: { email } });
    } catch (err: any) {
      setError(err?.message ?? "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a reset code"
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Mail size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
          <Send size={18} /> {loading ? "Sending..." : "Send Code"}
        </button>

        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 text-gray-600 text-sm hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}