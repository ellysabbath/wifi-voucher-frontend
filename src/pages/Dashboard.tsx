import { useVoucherStore } from '../store/voucherStore';

export default function Dashboard() {
  const vouchers = useVoucherStore((s) => s.vouchers);
  const total = vouchers.length;
  const used = vouchers.filter((v) => v.isUsed).length;
  const available = total - used;
  const printed = vouchers.filter((v) => v.printed).length;

  const stats = [
    { label: 'Jumla ya Vocha', value: total, color: 'bg-blue-500' },
    { label: 'Zilizotumika', value: used, color: 'bg-red-500' },
    { label: 'Zinazopatikana', value: available, color: 'bg-green-500' },
    { label: 'Zilizochapishwa', value: printed, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-6">
            <div className={`w-12 h-12 ${s.color} rounded-lg mb-4`}></div>
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}