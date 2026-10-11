import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function PasswordResetSuccess() {
  return (
    <AuthLayout title="Imefanikiwa!" subtitle="Nenosiri lako limebadilishwa kikamilifu">
      <div className="text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white">
                <CheckCircle2 size={44} strokeWidth={2.5} />
              </div>
            </div>
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20"></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Hongera!
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Nenosiri lako limebadilishwa kikamilifu. Sasa unaweza kuingia kwenye akaunti yako kwa nenosiri jipya.
        </p>

        {/* Info box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Usalama wa akaunti</p>
              <p className="text-green-700 text-xs mt-1">
                Kwa usalama wako, tumekutumia barua pepe ya uthibitisho. Kama hukufanya mabadiliko haya, wasiliana nasi mara moja.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          Ingia kwenye Akaunti <ArrowRight size={18} />
        </Link>
      </div>
    </AuthLayout>
  );
}