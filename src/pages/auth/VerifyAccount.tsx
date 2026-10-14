// src/pages/auth/VerifyAccount.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, CheckCircle2, Smartphone } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authApi, tokenStore } from "../../lib/auth";
import { isStaffRole } from "../../lib/roles";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const full = code.join("");
    if (full.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, code: full });
      if (res.access && res.refresh) {
        tokenStore.set({ access: res.access, refresh: res.refresh });
      }

      // Role-aware redirect
      try {
        const profile = await authApi.me();
        navigate(
          isStaffRole(profile.role) ? "/admin/dashboard" : "/user/dashboard",
          { replace: true }
        );
      } catch {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(err?.message ?? "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    try {
      await authApi.resendOtp({ email, purpose: "verify" });
      setInfo(
        "A fresh code has been sent to your email and phone (if a number is registered)."
      );
    } catch (err: any) {
      setError(err?.message ?? "Could not resend the code.");
    }
  };

  return (
    <AuthLayout
      title="Verify Account"
      subtitle={`We sent a 6-digit code to ${email}`}
    >
      {/* Dual-channel icons */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Mail size={28} />
        </div>
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Smartphone size={28} />
        </div>
      </div>

      {/* Where to look */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800 text-center">
        Check your <strong>email</strong>
        <br />
        <span className="text-xs">
          We also sent it via SMS to your registered phone number (if any).
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-center">
            Enter the 6-digit code
          </label>
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {info && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 text-center">
            {info}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <CheckCircle2 size={18} />{" "}
          {loading ? "Verifying…" : "Verify Account"}
        </button>

        <div className="text-center text-sm text-gray-600">
          Didn't get the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-semibold hover:underline"
          >
            Resend
          </button>
        </div>

        <div className="text-center text-xs text-gray-400">
          Codes expire 10 minutes after they're sent.
        </div>
      </form>
    </AuthLayout>
  );
}