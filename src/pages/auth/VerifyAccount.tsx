import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
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
    // Mock verification - badilisha na API halisi
    navigate('/login');
  };

  const handleResend = () => {
    alert('Msimbo mpya umetumwa kwenye barua pepe yako');
  };

  return (
    <AuthLayout
      title="Thibitisha Akaunti"
      subtitle="Tumekutumia msimbo wa tarakimu 6 kwenye barua pepe yako"
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Mail size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-center">
            Ingiza msimbo
          </label>
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
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
          <CheckCircle2 size={18} /> Thibitisha
        </button>

        <div className="text-center text-sm text-gray-600">
          Hukupata msimbo?{' '}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-semibold hover:underline"
          >
            Tuma tena
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}