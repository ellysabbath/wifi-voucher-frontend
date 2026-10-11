import { useState } from 'react';
import { useVoucherStore } from '../store/voucherStore';
import type { VoucherFormData, Duration } from '../types';
import { DATA_LIMITS, DURATION_LABELS } from '../types';

export default function GenerateVouchers() {
  const addVouchers = useVoucherStore((s) => s.addVouchers);
  const [form, setForm] = useState<VoucherFormData>({
    quantity: 10,
    duration: '1h',
    dataLimit: '500MB',
    prefix: 'WIFI',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVouchers(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Generate Vouchers</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Idadi ya Vocha</label>
          <input
            type="number"
            min={1}
            max={500}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Muda wa Uhalali</label>
          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value as Duration })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(DURATION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Kikomo cha Data</label>
          <select
            value={form.dataLimit}
            onChange={(e) => setForm({ ...form, dataLimit: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {DATA_LIMITS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Prefix ya Msimbo</label>
          <input
            type="text"
            value={form.prefix}
            onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase() })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
        >
          Generate Vouchers
        </button>

        {success && (
          <p className="mt-4 text-green-600 font-semibold text-center">
             Vocha {form.quantity} zimezalishwa kikamilifu!
          </p>
        )}
      </form>
    </div>
  );
}