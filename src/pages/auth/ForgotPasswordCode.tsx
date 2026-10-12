import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authApi } from "../../lib/auth";

export default function ForgotPasswordCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      document.getElementById(`fp-code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`fp-code-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const full = code.join("");
    if (full.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    navigate("/reset-password", { state: { email, code: full } });
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    try {
      await authApi.resendOtp({ email, purpose: "reset" });
      setInfo("A new reset code has been sent.");
    } catch (err: any) {
      setError(err?.message ?? "Could not resend code.");
    }
  };

  return (
    <AuthLayout title="Enter Code" subtitle={`We sent a 6-digit code to ${email}`}>
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-center">
            Verification code
          </label>
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`fp-code-${i}`}
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
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> Verify Code
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="flex items-center gap-1 text-gray-600 hover:text-primary">
            <ArrowLeft size={16} /> Back
          </Link>
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-semibold hover:underline"
          >
            Resend code
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}