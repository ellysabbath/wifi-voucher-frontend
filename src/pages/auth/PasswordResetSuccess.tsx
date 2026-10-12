import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";

export default function PasswordResetSuccess() {
  return (
    <AuthLayout title="Success!" subtitle="Your password has been reset">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white">
                <CheckCircle2 size={44} strokeWidth={2.5} />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">All done!</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Your password has been reset. You can now sign in with the new password.
        </p>

        <Link
          to="/login"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          Sign In <ArrowRight size={18} />
        </Link>
      </div>
    </AuthLayout>
  );
}