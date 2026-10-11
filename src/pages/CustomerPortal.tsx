import { useState } from 'react';
import { useVoucherStore } from '../store/voucherStore';
import { DURATION_LABELS } from '../types';

export default function CustomerPortal() {
  const vouchers = useVoucherStore((s) => s.vouchers);
  const useVoucher = useVoucherStore((s) => s.useVoucher);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const voucher = vouchers.find((v) => v.code === code.toUpperCase());

    if (!voucher) {
      setMessage({ type: 'error', text: 'Msimbo haupo. Angalia tena.' });
      return;
    }
    if (voucher.isUsed) {
      setMessage({ type: 'error', text: ' Msimbo huu umetumika.' });
      return;
    }

    useVoucher(voucher.code);
    setMessage({
      type: 'success',
      text: `Karibu! Una ${DURATION_LABELS[voucher.duration]} na ${voucher.dataLimit}.`,
    });
    setCode('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-blue-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">WiFi Voucher</h1>
          <p className="text-gray-500 mt-2">Ingiza msimbo wako kupata mtandao</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="WIFI-XXXX-XXXX"
            className="w-full border-2 rounded-lg px-4 py-3 text-center font-mono text-lg focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Ingia Mtandao
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-4 rounded-lg text-center font-semibold ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}