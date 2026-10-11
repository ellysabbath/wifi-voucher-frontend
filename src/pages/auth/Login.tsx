import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Jaza barua pepe na nenosiri');
      return;
    }

    // Mock login - badilisha na API halisi
    if (form.password.length < 6) {
      setError('Nenosiri si sahihi');
      return;
    }

    // Karibu kwenye dashboard
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="Ingia" subtitle="Karibu tena! Ingia kwenye akaunti yako">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Barua Pepe</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="jina@bahisda.org"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Nenosiri</label>
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
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-600">Nikumbuke</span>
          </label>
          <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
            Umesahau nenosiri?
          </Link>
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
          <LogIn size={18} /> Ingia
        </button>

        <p className="text-center text-sm text-gray-600">
          Hauna akaunti?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Jisajili
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}