import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function ForgotPasswordCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || 'barua pepe yako';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`fp-code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`fp-code-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Ingiza msimbo kamili wa tarakimu 6');
      return;
    }
    navigate('/reset-password', { state: { email, code: fullCode } });
  };

  const handleResend = () => {
    alert('Msimbo mpya umetumwa kwenye barua pepe yako');
  };

  return (
    <AuthLayout
      title="Ingiza Msimbo"
      subtitle={`Tumekutumia msimbo wa tarakimu 6 kwenye ${email}`}
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-center">
            Msimbo wa uthibitisho
          </label>
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`fp-code-${i}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
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

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> Thibitisha Msimbo
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="flex items-center gap-1 text-gray-600 hover:text-primary">
            <ArrowLeft size={16} /> Rudi
          </Link>
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-semibold hover:underline"
          >
            Tuma tena msimbo
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}