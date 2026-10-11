import { useState } from 'react';
import { useVoucherStore } from '../store/voucherStore';
import VoucherCard from '../components/VoucherCard';

export default function PrintVouchers() {
  const vouchers = useVoucherStore((s) => s.vouchers);
  const markPrinted = useVoucherStore((s) => s.markPrinted);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    markPrinted(selected);
    setTimeout(() => window.print(), 100);
  };

  const selectedVouchers = vouchers.filter((v) => selected.includes(v.id));

  return (
    <div>
      <div className="no-print">
        <h1 className="text-3xl font-bold mb-6">Print Vouchers</h1>
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setSelected(vouchers.map((v) => v.id))}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Chagua Zote
          </button>
          <button
            onClick={() => setSelected([])}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Ondoa Zote
          </button>
          <button
            onClick={handlePrint}
            disabled={selected.length === 0}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            🖨️ Chapisha ({selected.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              onClick={() => toggleSelect(v.id)}
              className={`cursor-pointer rounded-lg transition ${
                selected.includes(v.id) ? 'ring-4 ring-primary' : ''
              }`}
            >
              <VoucherCard voucher={v} />
            </div>
          ))}
        </div>
      </div>

      <div className="print-only hidden">
        {selectedVouchers.map((v) => (
          <VoucherCard key={v.id} voucher={v} />
        ))}
      </div>
    </div>
  );
}