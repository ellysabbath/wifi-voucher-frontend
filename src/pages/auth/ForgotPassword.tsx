import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Ingiza barua pepe yako');
      return;
    }

    // Mock - nenda kwenye ukurasa wa code
    navigate('/forgot-password-code', { state: { email } });
  };

  return (
    <AuthLayout
      title="Umesahau Nenosiri?"
      subtitle="Ingiza barua pepe yako ili tukuTumie msimbo wa kubadilisha nenosiri"
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Mail size={36} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Barua Pepe</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jina@bahisda.org"
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
          <Send size={18} /> Tuma Msimbo
        </button>

        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 text-gray-600 text-sm hover:text-primary"
        >
          <ArrowLeft size={16} /> Rudi kwenye kuingia
        </Link>
      </form>
    </AuthLayout>
  );
}