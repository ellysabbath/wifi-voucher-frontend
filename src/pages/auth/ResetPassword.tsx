import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  // Password strength
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(form.password);
  const strengthLabels = ['Dhaifu sana', 'Dhaifu', 'Wastani', 'Nzuri', 'Nzuri sana', 'Imara'];
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Nenosiri liwe na herufi 6 au zaidi');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Nenosiri hazifanani');
      return;
    }

    navigate('/password-reset-success');
  };

  return (
    <AuthLayout
      title="Weka Nenosiri Jipya"
      subtitle="Chagua nenosiri imara kwa akaunti yako"
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <KeyRound size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nenosiri Jipya</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
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

          {/* Strength indicator */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < strength ? strengthColors[strength] : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Nguvu: <span className="font-semibold">{strengthLabels[strength]}</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Rudia Nenosiri</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
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
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          <KeyRound size={18} /> Badilisha Nenosiri
        </button>
      </form>
    </AuthLayout>
  );
}