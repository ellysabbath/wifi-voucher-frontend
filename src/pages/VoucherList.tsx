import { useState } from 'react';
import { useVoucherStore } from '../store/voucherStore';
import VoucherTable from '../components/VoucherTable';

export default function VoucherList() {
  const vouchers = useVoucherStore((s) => s.vouchers);
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [search, setSearch] = useState('');

  const filtered = vouchers.filter((v) => {
    if (filter === 'used' && !v.isUsed) return false;
    if (filter === 'unused' && v.isUsed) return false;
    if (search && !v.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Voucher List</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tafuta msimbo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Zote</option>
          <option value="used">Zilizotumika</option>
          <option value="unused">Hazijatumika</option>
        </select>
      </div>
      <VoucherTable vouchers={filtered} />
    </div>
  );
}