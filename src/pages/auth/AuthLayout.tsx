import  { type ReactNode } from 'react';
import { Church } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - branding (haiscroll) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-700 to-indigo-800 text-white p-12 flex-col justify-between relative overflow-hidden flex-shrink-0">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Church size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Bahi SDA</h1>
              <p className="text-xs text-blue-100">Mfumo wa Kanisa</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Karibu kwenye mfumo wa usimamizi wa kanisa
          </h2>
          <p className="text-blue-100 text-lg max-w-md">
            Simamia wanachama, tuma SMS, na fuatilia matukio yote ya kanisa mahali pamoja.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-100">
          © 2026 Bahi SDA Church. Haki zote zimehifadhiwa.
        </div>
      </div>

      {/* Right side - form (inascroll yenyewe) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="min-h-full flex items-start lg:items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md py-6">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Church size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary">Bahi SDA</h1>
                  <p className="text-xs text-gray-500">Mfumo wa Kanisa</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                  {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}